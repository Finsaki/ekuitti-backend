import { SqlQuerySpec } from '@azure/cosmos'
import * as logger from '../utils/logger'
import { userContainer, checkIfContainerInitialized } from '../utils/daoHelper'
import { User } from '../models/user'

/**
 * This class houses the CRUD operations to manage users in the database
 * It is used by the controller class users.ts
 */

// !!!Partitionkey could be changed to eAddressId
// For simplicity this is a constant partition key
const partitionKey: string = undefined

//Used to find users with spesific SQL query
const find = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for users from the database')
  checkIfContainerInitialized(userContainer)
  const { resources } = await userContainer.items.query(querySpec).fetchAll()
  return resources
}

//Used to add a new User to database
const addItem = async (user: User) => {
  logger.debug('Adding a user to the database')
  const { resource: doc } = await userContainer.items.create(user)
  return doc
}

//Used to delete a User from the database with id
const deleteItem = async (itemId: string) => {
  logger.debug('Delete a user from the database')
  const { resource } = await userContainer.item(itemId, partitionKey).delete()
  return resource
}

//Used to fetch a spesific User with id
const getItem = async (itemId: string) => {
  logger.debug('Getting a user from the database')
  const { resource } = await userContainer.item(itemId, partitionKey).read()
  return resource
}

//Used to update name for an existing item in the database
const addToReceiptArray = async (itemId: string, receiptId: string) => {
  logger.debug('Adding a new receipt for user')
  const doc = await getItem(itemId)
  doc.receiptIds.push(receiptId)

  const { resource: replaced } = await userContainer
    .item(itemId, partitionKey)
    .replace(doc)
  return replaced
}

//Used to delete a receipt from users receipt list !!!Only to be used in development
const deleteFromReceiptArray = async (itemId: string, receiptId: string) => {
  logger.debug('Deleting a receipt from users receipt list')
  const doc = await getItem(itemId)
  const receiptList: string[] = doc.receiptIds
  const newReceiptList = receiptList.filter(receipt => receipt !== receiptId)
  doc.receiptIds = newReceiptList

  const { resource: replaced } = await userContainer
    .item(itemId, partitionKey)
    .replace(doc)
  return replaced
}

export { find, addItem, getItem, deleteItem, addToReceiptArray, deleteFromReceiptArray }