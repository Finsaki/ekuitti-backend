import { SqlQuerySpec } from '@azure/cosmos'
import * as logger from '../utils/logger'
import { receiptContainer, checkIfContainerInitialized } from '../utils/daoHelper'
import { Receipt } from '../models/receipt'

/**
 * Houses the CRUD operations to manage receipts in the database
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

//Used to update name for an existing item in the database
const addToReceiptArray = async (receiptId: string, userId: string) => {
  logger.debug('Adding a new userid for forwardedUsers array in receipt')
  let doc: Receipt = await getItem(receiptId)
  if (!doc.forwardedUsers) {
    const emptyArray: string[] = []
    doc.forwardedUsers = emptyArray
  }
  doc.forwardedUsers.push(userId)

  const { resource: replaced } = await receiptContainer
    .item(receiptId, partitionKey)
    .replace(doc)
  return replaced
}

//Used to fetch a spesific receipt with id
const getItem = async (itemId: string) => {
  logger.debug('Getting a receipt from the database')
  const { resource } = await receiptContainer.item(itemId, partitionKey).read()
  return resource
}

export { findReceipts, addItem, getItem, deleteItem, addToReceiptArray }