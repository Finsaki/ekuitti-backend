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

//Used to find all users with spesific SQL query
const findUsers = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for users from the database')
  checkIfContainerInitialized(userContainer)
  const { resources } = await userContainer.items.query(querySpec).fetchAll()
  return resources
}

//Used to find a single user with spesific SQL query
const findUser = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for users from the database')
  checkIfContainerInitialized(userContainer)
  //CosmosDB returns queries in arrays
  const { resources } = await userContainer.items.query(querySpec).fetchAll()
  //This should not be possible but adding incase of manual changes to db
  //createUserContainer method in daoHelper class enforces unique usernames
  if (resources.length > 1) {
    throw 'database: more than one user with given username found'
  }
  //taking the first and only item from array
  const userItem = resources[0]
  return userItem
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

export { findUsers, findUser, addItem, getItem, deleteItem }