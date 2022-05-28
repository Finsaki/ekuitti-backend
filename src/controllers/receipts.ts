import { Request, Response, Router } from 'express'
import { Receipt, Receipts } from '../models/receipt'
import { findReceipts, addItem, getItem, deleteItem, addToReceiptArray } from '../models/receiptDao' //find
import { findUser } from '../models/userDao'
import { userExtractor } from '../utils/middleware'
import * as logger from '../utils/logger'

/**
 * This class connects the API endpoints and database CRUD operations from model
 * class receiptDao.ts
 */

const receiptsRouter = Router()

//testReceipts without database connection
//Needs to be above get('/:id') because otherwise path is never registered
receiptsRouter.get('/test', async (_req: Request, res: Response) => {
  const json = await import('../../docs/fake_receipts.json') // import local json file for testing
  const data: Receipts = json.default //.default gets the actual data
  res.json(data)
})

//Show all receipts where the current user is the original owner
receiptsRouter.get('/', userExtractor, async (req: Request, res: Response) => {
  const user = req.user

  //only the receipts where eAddressId matches
  //'SELECT * FROM root r WHERE r.eAddressId = @userEAddress ORDER BY r.receiptTimeStamp DESC'
  const querySpec = {
    query: 'SELECT * FROM root r WHERE r.eAddressId = @userEAddress',
    parameters: [
      { name: '@userEAddress', value: user.eAddressId }
    ]
  }
  const values = await findReceipts(querySpec)

  logger.debug(`${values.length} values found`)

  res.json(values)
})

//Show all receipts which the current user has forwarded
//Needs to be above get('/:id') because otherwise path is never registered
receiptsRouter.get('/forwarded', userExtractor, async (req: Request, res: Response) => {
  const user = req.user
  //only the receipts where eAddressId matches and forwardedUsers field exists and isnt empty
  const querySpec = {
    query: 'SELECT * FROM root r WHERE r.eAddressId = @userEAddress AND (IS_DEFINED(r.forwardedUsers) AND NOT IS_NULL(r.forwardedUsers))',
    parameters: [
      { name: '@userEAddress', value: user.eAddressId }
    ]
  }
  const values = await findReceipts(querySpec)

  logger.debug(`${values.length} values found`)

  res.json(values)
})

//Returns all the data that eAddress holder has shared to current user
receiptsRouter.get('/shared/:eAddressId', userExtractor, async (req: Request, res: Response) => {
  const user = req.user

  if (user.eAddressId === req.params.eAddressId) {
    return res.status(400).json({ error: 'user cannot have receipts forwarded from themself' })
  }

  const querySpec = {
    query: 'SELECT * FROM root r WHERE r.eAddressId = @requestedEAddress AND (IS_DEFINED(r.forwardedUsers) AND ARRAY_CONTAINS(r.forwardedUsers, @requesterId))',
    parameters: [
      { name: '@requestedEAddress', value: req.params.eAddressId },
      { name: '@requesterId', value: user.id }
    ]
  }
  const values = await findReceipts(querySpec)

  logger.debug(`${values.length} values found`)

  res.json(values)
})

//get a single item by id
receiptsRouter.get('/:id', userExtractor, async (req: Request, res: Response) => {
  const user = req.user

  const item: Receipt = await getItem(req.params.id)

  if (!item) {
    return res.status(500).json({ error: 'database: receipt matching given id not found' })
  }

  if (item.eAddressId === user.eAddressId) {
    res.json(item)
  } else if (item.forwardedUsers) {
    if (item.forwardedUsers.includes(user.eAddressId)) {
      res.json(item)
    } else {
      return res.status(400).json({ error: 'access denied: receipt is not forwarded to current user' })
    }
  } else {
    return res.status(400).json({ error: 'access denied: current user is not the owner of this receipt and it is not forwarded to anyone' })
  }
})

//addReceipt
receiptsRouter.post('/addreceipt', userExtractor, async (req: Request, res: Response) => {
  const item = req.body
  const user = req.user

  if (item.eAddressId === undefined) {
    return res.status(400).json({ error: 'eAddress is missing' })
  } else if (item.merchant === undefined) {
    return res.status(400).json({ error: 'merchant information is missing' })
  } else if (item.products === undefined) {
    return res.status(400).json({ error: 'product information is missing' })
  } //add more checks for receipt validation...

  if (item.eAddressId !== user.eAddressId) {
    return res.status(400).json({ error: 'eAddress is not valid for current user' })
  }

  //adding the receipt to database
  await addItem(item)

  res.redirect('/')
})

//forwardReceipt
receiptsRouter.post('/forwardreceipt', userExtractor, async (req: Request, res: Response) => {
  const item = req.body
  const user = req.user
  const receiptId = item.receiptId
  const recipientAddress = item.eAddressId

  if (recipientAddress === user.eAddressId) {
    return res.status(400).json({ error: 'forwarding receipts to oneself is not allowed' })
  }

  const receipt: Receipt = await getItem(receiptId)

  if (!receipt) {
    return res.status(500).json({ error: 'database: no receipt with given id was found' })
  } else if(receipt.eAddressId !== user.eAddressId) {
    return res.status(400).json({ error: 'forwarding receipts is only allowed for the original owner of the receipt' })
  }

  const querySpec = {
    query: 'SELECT * FROM users u WHERE u.eAddressId = @eAddress',
    parameters: [
      { name: '@eAddress', value: recipientAddress }
    ]
  }

  //finding a user with eAddressId
  const userItem = await findUser(querySpec)

  if (!userItem) {
    return res.status(500).json({ error: 'database: no user with given eAddress was found' })
  }

  if (receipt.forwardedUsers) {
    if (receipt.forwardedUsers.includes(userItem.eAddressId)) {
      return res.status(500).json({ error: 'database: user already has access to receipt' })
    }
  }

  await addToReceiptArray(receiptId, userItem.id)

  res.redirect('/')
})

//deleteReceipt, not for production!!!
receiptsRouter.delete('/:id', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'production') {
    //middleware will catch not found database exception
    await deleteItem(req.params.id)

    res.json(`receipt ${req.params.id} successfully deleted`)
  } else {
    res.json('delete not allowed')
  }
})

export { receiptsRouter }