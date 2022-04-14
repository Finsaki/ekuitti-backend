import { Database, Container, SqlQuerySpec, CosmosClient } from "@azure/cosmos"
import * as logger from '../utils/logger'
import * as config from '../utils/config'

// For simplicity we'll set a constant partition key
const partitionKey: string = undefined
let database: Database
let container: Container
type Item = {date: number, completed: boolean}

const init = async (client: CosmosClient) => {
  logger.info('Setting up the database...')
  const dbResponse = await client.databases.createIfNotExists({
    id: config.DB_ID
  })
  database = dbResponse.database
  logger.info('Setting up the database...done!')
  logger.info('Setting up the container...')
  const coResponse = await database.containers.createIfNotExists({
    id: config.CONT_ID
  })
  container = coResponse.container
  logger.info('Setting up the container...done!')
}

const find = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for items from the database')
  if (!container) {
    throw new Error('Collection is not initialized.')
  }
  const { resources } = await container.items.query(querySpec).fetchAll()
  return resources
}

const addItem = async (item: Item) => {
  logger.debug('Adding an item to the database')
  item.date = Date.now()
  item.completed = false
  const { resource: doc } = await container.items.create(item)
  return doc
}

const updateItem = async (itemId: string) => {
  logger.debug('Update an item in the database')
  const doc = await getItem(itemId)
  doc.completed = true

  const { resource: replaced } = await container
    .item(itemId, partitionKey)
    .replace(doc)
  return replaced
}

const getItem = async (itemId: string) => {
  logger.debug('Getting an item from the database')
  const { resource } = await container.item(itemId, partitionKey).read()
  return resource
}

export { init, find, addItem, updateItem, getItem } 