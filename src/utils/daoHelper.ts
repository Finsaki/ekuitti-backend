import { Database, Container, CosmosClient } from '@azure/cosmos'
import * as logger from './logger'
import * as config from './config'
import { createUsers, createReceipts } from './daoDevHelper'

//Variables for housing container info in this class
let receiptContainer: Container
let userContainer: Container
let taskContainer: Container

/**
 * Used to set up the database connection when starting the program
 * @param client Azure Cosmos DB connection
 */
const init = async (client: CosmosClient) => {
  await start(client, config.PRIMARY_DB_ID)
}

/**
 * For setting up containers for specific Azure cosmosDB database
 * If some values cannot be read then cleaninit() method is used
 * @param client Azure Cosmos DB connection
 * @param dbid Azure Cosmos DB database name
 */
const start = async (client: CosmosClient, dbid: string) => {
  logger.info('Establishing database connections...')
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
    logger.error('Failed to verify all database resources!')
    await cleanInit(client)
  } finally {
    logger.info('Database connections established!')
    logger.info('Program started, awaiting requests...')
  }
}


//If reading databases or containers failed then clean init is performed
//This is the case if database or containers do not yet exist
const cleanInit = async (client: CosmosClient) => {
  logger.info('Checking for missing resources...')

  //Setting up database
  const databaseResponse = await createDatabase(client, config.PRIMARY_DB_ID)
  const database = databaseResponse.database
  checkIfDatabaseCreated(databaseResponse.statusCode, config.PRIMARY_DB_ID)

  //setting up user container
  const userContainerResponse = await createUserContainer(database, config.USER_CONT_ID)
  userContainer = userContainerResponse.container
  const userContAdded = checkIfContainerCreated(userContainerResponse.statusCode, config.USER_CONT_ID)

  //setting up receipt container
  const receiptContainerResponse = await createContainer(database, config.RECEIPT_CONT_ID)
  receiptContainer = receiptContainerResponse.container
  const receiptContAdded = checkIfContainerCreated(receiptContainerResponse.statusCode, config.RECEIPT_CONT_ID)

  //Filling developent database containers with test data if they were created
  if (process.env.NODE_ENV === 'development') {
    logger.info('Development mode detected, inserting test data to new containers...')
    if (userContAdded) {
      await createUsers(userContainer)
    }
    if (receiptContAdded) {
      await createReceipts(receiptContainer)
    }
  }
}

//Getting the database response that has the current state of the database which is saved to a variable in this class
//database response also contains the status if new database was created or if one existed already
const createDatabase = async (client: CosmosClient, dbId: string) => {
  logger.info(`Verifying database [${dbId}]...`)
  const dbResponse = await client.databases.createIfNotExists({
    id: dbId,
  })
  return dbResponse
}

//Getting the container response that has the current state of the container and status of creation
const createContainer = async (database: Database, contId: string) => {
  logger.info(`Verifying container [${contId}]...`)
  const coResponse = await database.containers.createIfNotExists({
    id: contId,
  })
  return coResponse
}

//Special container response creation tool for user where username and eAddressId should be unique
//container response has the current state of the container and status of creation
//Azure will make sure that no unique values can be added, will respond with Error 500
const createUserContainer = async (database: Database, contId: string) => {
  logger.info(`Verifying container [${contId}]...`)
  const coResponse = await database.containers.createIfNotExists({
    id: contId,
    uniqueKeyPolicy: {
      uniqueKeys: [{ paths: ['/username'] }, { paths: ['/eAddressId'] }],
    },
  })
  return coResponse
}

//Can be used to check if container is initialized and is safe to be queried
const checkIfContainerInitialized = (container: Container) => {
  if (!container) {
    throw new Error('Collection is not initialized.')
  }
}

//Checking if a new container was created
const checkIfContainerCreated = (statusCode: number, containerName: string) => {
  if (statusCode === 201) {
    logger.info(`Container [${containerName}] was missing and is created`)
    return true
  } else {
    logger.info(`Container [${containerName}] verified`)
  }
  return false
}

//Checking if a new database was created
const checkIfDatabaseCreated = (statusCode: number, databaseName: string) => {
  if (statusCode === 201) {
    logger.info(`Database [${databaseName}] was missing and is created`)
  } else {
    logger.info(`Database [${databaseName}] verified`)
  }
}

export {
  init,
  checkIfContainerInitialized,
  receiptContainer,
  userContainer,
  taskContainer,
}
