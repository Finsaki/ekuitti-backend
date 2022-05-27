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
const findUsers = async (querySpec: SqlQuerySpec) => {
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

//Used to delete given receiptId from all users that have it !!!Only to be used in development
//no authorization is used as run can only happen in devepoment
const deleteReceiptFromAllUsers= async (receiptId: string) => {
  logger.debug('Deleting a receipt from users receipt list')
  //this query finds all users which have the given receiptId in their receiptIds array
  //this has to be queried for all users because receiptIds can be sent to other users
  const querySpec = {
    query: 'SELECT users.id FROM users WHERE ARRAY_CONTAINS(users.receiptIds, @receiptId)',
    parameters: [
      { name: '@receiptId', value: receiptId }
    ]
  }

  try {
    //queries will be returned in [ {id: 1234} ] form
    const doc = await findUsers(querySpec)

    //to iterate over all found objects in the array
    for (let i:number = 0; i < doc.length; i++) {
      const user: User = await getItem(doc[i].id)
      const receiptArray = user.receiptIds
      const newReceiptArray = receiptArray.filter(receipt => receipt !== receiptId)
      user.receiptIds = newReceiptArray

      logger.debug('Removing a receiptId from user')
      await userContainer
        .item(doc[i].id, partitionKey)
        .replace(user)
    }

  } catch (e) {
    //return false and let the receipt deletion know that deletion should be cancelled
    return false
  }

  return true
}

export { findUsers, addItem, getItem, deleteItem, addToReceiptArray, deleteReceiptFromAllUsers }