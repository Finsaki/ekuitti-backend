//Example model to handle Database connection methods from controller tasklist

import { SqlQuerySpec } from "@azure/cosmos"
import * as logger from '../utils/logger'
import { taskContainer } from "../utils/dao";

// For simplicity this is a constant partition key
const partitionKey: string = undefined
type Item = {date: number, completed: boolean}

//Used to find items with spesific SQL query
const find = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for items from the database')
  if (!taskContainer) {
    throw new Error('Collection is not initialized.')
  }
  const { resources } = await taskContainer.items.query(querySpec).fetchAll()
  return resources
}

//Used to add a new Item to database
const addItem = async (item: Item) => {
  logger.debug('Adding an item to the database')
  item.date = Date.now()
  item.completed = false
  const { resource: doc } = await taskContainer.items.create(item)
  return doc
}

//Used to update name for an existing item in the database
const updateItemName = async (itemId: string, name: string) => {
  logger.debug('Update an item in the database')
  const doc = await getItem(itemId)
  doc.name = name

  const { resource: replaced } = await taskContainer
    .item(itemId, partitionKey)
    .replace(doc)
  return replaced
}

//Used to delete a spesific item with id
const deleteItem = async (itemId: string) => {
  logger.debug('Delete an item in the database')
  const { resource } = await taskContainer.item(itemId, partitionKey).delete()
  return resource
}

//Used to fetch a spesific item with id
const getItem = async (itemId: string) => {
  logger.debug('Getting an item from the database')
  const { resource } = await taskContainer.item(itemId, partitionKey).read()
  return resource
}

export { find, addItem, updateItemName, getItem, deleteItem } 