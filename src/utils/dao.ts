import { Database, Container, CosmosClient } from '@azure/cosmos'
import * as logger from '../utils/logger'
import * as config from '../utils/config'

let receiptContainer: Container
let userContainer: Container
let taskContainer: Container

//used to set up the database connection when starting the program
const init = async (client: CosmosClient) => {
  logger.info('Setting up databases...')

  const primDatabase = await createDatabase(client, config.PRIMARY_DB_ID)
  const secDatabase = await createDatabase(client, config.SECONDARY_DB_ID)

  logger.info('Setting up databases...done!')
  logger.info('Setting up containers...')

  receiptContainer = await createContainer(primDatabase, config.RECEIPT_CONT_ID)
  userContainer = await createContainer(primDatabase, config.USER_CONT_ID)
  taskContainer = await createContainer(secDatabase, config.ITEM_CONT_ID)

  logger.info('Setting up containers...done!')
}

const createDatabase = async (client: CosmosClient, dbId: string) => {
  const dbResponse = await client.databases.createIfNotExists({
    id: dbId
  })
  return dbResponse.database
}

const createContainer = async (database: Database, contId: string) => {
  const coResponse = await database.containers.createIfNotExists({
    id: contId
  })
  return coResponse.container
}

const checkIfContainerInitialized = (container: Container) => {
  if (!container) {
    throw new Error('Collection is not initialized.')
  }
}

export {
  init, checkIfContainerInitialized,
  receiptContainer, userContainer, taskContainer
}