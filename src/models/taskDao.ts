//Example model to handle Database connection methods from controller tasklist

import { SqlQuerySpec } from '@azure/cosmos'
import * as logger from '../utils/logger'
import { taskContainer, checkIfContainerInitialized } from '../utils/dao'

// For simplicity this is a constant partition key
const partitionKey: string = undefined
//This is just for reference, in the post method other fields can be added as well
//Item here could actually be named Task but it is named Item because objects in
//cosmosdb collection are called items.
//type Task should be housed in its own file: task.ts in src/models
type Item = {date: number, completed: boolean}

//Used to find items with spesific SQL query
const find = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for tasks from the database')
  checkIfContainerInitialized(taskContainer)
  const { resources } = await taskContainer.items.query(querySpec).fetchAll()
  return resources
}

//Used to add a new Item to database
const addItem = async (item: Item) => {
  logger.debug('Adding a task to the database')
  item.date = Date.now()
  item.completed = false
  const { resource: doc } = await taskContainer.items.create(item)
  return doc
}

//Used to update name for an existing item in the database
const updateItemName = async (itemId: string, name: string) => {
  logger.debug('Update a task in the database')
  const doc = await getItem(itemId)
  doc.name = name

  const { resource: replaced } = await taskContainer
    .item(itemId, partitionKey)
    .replace(doc)
  return replaced
}

//Used to delete a spesific item with id
const deleteItem = async (itemId: string) => {
  logger.debug('Delete a task in the database')
  const { resource } = await taskContainer.item(itemId, partitionKey).delete()
  return resource
}

//Used to fetch a spesific item with id
const getItem = async (itemId: string) => {
  logger.debug('Getting a task from the database')
  const { resource } = await taskContainer.item(itemId, partitionKey).read()
  return resource
}

export { find, addItem, updateItemName, getItem, deleteItem }