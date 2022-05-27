import { Database, Container, CosmosClient } from '@azure/cosmos'
import * as logger from './logger'
import * as config from './config'
import { genRandomString, sha512 } from './hashHelper'

let receiptContainer: Container
let userContainer: Container
let taskContainer: Container

//used to set up the database connection when starting the program
const init = async (client: CosmosClient) => {
  await start(client, config.PRIMARY_DB_ID)
}

const start = async (client: CosmosClient, dbid: string) => {
  try {
    const db = await client
      .database(dbid)
      .read()
      .then((r) => r.database)
    userContainer = await db
      .container(config.USER_CONT_ID)
      .read()
      .then((r) => r.container)
    receiptContainer = await db
      .container(config.RECEIPT_CONT_ID)
      .read()
      .then((r) => r.container)
  } catch {
    await cleanInit(client)
  } finally {
    logger.info('[info] Everything setup')
    logger.info('[info] Starting...')
  }
}

const cleanInit = async (client: CosmosClient) => {
  const db = await createDatabase(client, config.PRIMARY_DB_ID)
  userContainer = await createUserContainer(db, config.USER_CONT_ID)
  receiptContainer = await createContainer(db, config.RECEIPT_CONT_ID)
  await createUsers(userContainer)
  await createReceipts(receiptContainer)
}

const createUsers = async (userContainer: Container) => {
  logger.info('[info] Populating users for testing...')
  const json = await import('../../docs/users.json')
  const users = json.default
  users.forEach(async (user) => {
    const salt = genRandomString(16)
    await userContainer.items.create({
      username: user.username,
      name: user.name,
      passwordData: {
        passwordHash: sha512(user.password, salt),
        salt: salt,
      },
      eAddressId: user.eAddressId,
    })
  })
  logger.info('[info] Done!')
}

const createReceipts = async (receiptContainer: Container) => {
  logger.info('[info] Populating receipts for testing...')
  const json = await import('../../docs/fake_receipts.json')
  const receipts = json.default
  receipts.forEach(async (receipt) => {
    await receiptContainer.items.create(receipt)
  })
  logger.info('[info] Done!')
}

const createDatabase = async (client: CosmosClient, dbId: string) => {
  logger.info('[info] Setting up database...')
  const dbResponse = await client.databases.createIfNotExists({
    id: dbId,
  })
  logger.info('[info] Done!')
  return dbResponse.database
}

const createContainer = async (database: Database, contId: string) => {
  logger.info('[info] Setting up container...')
  const coResponse = await database.containers.createIfNotExists({
    id: contId,
  })
  logger.info('[info] Done!')
  return coResponse.container
}

//Special container creation tool for user where username and eAddressId should be unique
//Azure will make sure that no unique values can be added, will respond with Error 500
const createUserContainer = async (database: Database, contId: string) => {
  logger.info('[info] Setting up container...')
  const coResponse = await database.containers.createIfNotExists({
    id: contId,
    uniqueKeyPolicy: {
      uniqueKeys: [{ paths: ['/username'] }, { paths: ['/eAddressId'] }],
    },
  })
  logger.info('[info] Done!')
  return coResponse.container
}

const checkIfContainerInitialized = (container: Container) => {
  if (!container) {
    throw new Error('Collection is not initialized.')
  }
}

export {
  init,
  checkIfContainerInitialized,
  receiptContainer,
  userContainer,
  taskContainer,
}
