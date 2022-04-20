//Example model to handle Database connection methods from controller tasklist

import { Database, Container, SqlQuerySpec, CosmosClient } from "@azure/cosmos"
import * as logger from '../utils/logger'
import * as config from '../utils/config'

// For simplicity this is a constant partition key
const partitionKey: string = undefined
let database: Database
let container: Container
type Item = {date: number, completed: boolean}

//used to set up the database connection when starting the program
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

//Used to find items with spesific SQL query
const find = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for items from the database')
  if (!container) {
    throw new Error('Collection is not initialized.')
  }
  const { resources } = await container.items.query(querySpec).fetchAll()
  return resources
}

//Used to add a new Item to database
const addItem = async (item: Item) => {
  logger.debug('Adding an item to the database')
  item.date = Date.now()
  item.completed = false
  const { resource: doc } = await container.items.create(item)
  return doc
}

//Used to update name for an existing item in the database
const updateItemName = async (itemId: string, name: string) => {
  logger.debug('Update an item in the database')
  const doc = await getItem(itemId)
  doc.name = name

  const { resource: replaced } = await container
    .item(itemId, partitionKey)
    .replace(doc)
  return replaced
}

//Used to delete a spesific item with id
const deleteItem = async (itemId: string) => {
  logger.debug('Delete an item in the database')
  const { resource } = await container.item(itemId, partitionKey).delete()
  return resource
}

//Used to fetch a spesific item with id
const getItem = async (itemId: string) => {
  logger.debug('Getting an item from the database')
  const { resource } = await container.item(itemId, partitionKey).read()
  return resource
}

export { init, find, addItem, updateItemName, getItem, deleteItem } 