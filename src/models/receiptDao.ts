import { SqlQuerySpec } from '@azure/cosmos'
import * as logger from '../utils/logger'
import { receiptContainer, checkIfContainerInitialized } from '../utils/daoHelper'
import { Receipt } from '../models/receipt'

/**
 * This class houses the CRUD operations to manage receipts in the database
 * It is used by the controller class receipts.ts
 */

// !!!Partitionkey could be changed to eAddressId
// For simplicity this is a constant partition key
const partitionKey: string = undefined

//Used to find receipts with spesific SQL query
const findReceipts = async (querySpec: SqlQuerySpec) => {
  logger.debug('Querying for receipts from the database')
  checkIfContainerInitialized(receiptContainer)
  const { resources } = await receiptContainer.items.query(querySpec).fetchAll()
  return resources
}

//Used to add a new Receipt to database
const addItem = async (receipt: Receipt) => {
  logger.debug('Adding a receipt to the database')
  //checking if date already exists, this could be the case when manually adding receipts
  if (!receipt.receiptTimeStamp) {
    receipt.receiptTimeStamp = new Date().toJSON()
  }
  const { resource: doc } = await receiptContainer.items.create(receipt)
  return doc
}

//!!!Receipts should be immutable, not to be used in production
const deleteItem = async (itemId: string) => {
  logger.debug('Delete a receipt from the database')
  const { resource } = await receiptContainer.item(itemId, partitionKey).delete()
  return resource
}

//Used to fetch a spesific receipt with id
const getItem = async (itemId: string) => {
  logger.debug('Getting a receipt from the database')
  const { resource } = await receiptContainer.item(itemId, partitionKey).read()
  return resource
}

export { findReceipts, addItem, getItem, deleteItem }