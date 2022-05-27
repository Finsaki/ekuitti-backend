import { Request, Response, Router } from 'express'
import { Receipt, Receipts } from '../models/receipt'
import { addItem, getItem, deleteItem } from '../models/receiptDao' //find
import { addToReceiptArray, deleteReceiptFromAllUsers } from '../models/userDao'
import { userExtractor } from '../utils/middleware'
//import { find } from '../models/userDao'

/**
 * This class connects the API endpoints and database CRUD operations from model
 * class receiptDao.ts
 */

const receiptsRouter = Router()

//testReceipt without database connection
receiptsRouter.get('/test', async (_req: Request, res: Response) => {
  const json = await import('../../docs/fake_receipts.json') // import local json file for testing
  const data: Receipts = json.default //.default gets the actual data
  res.json(data)
})

//Show all receipts in database. Not wanted for production, modify later to work with user!!!
receiptsRouter.get('/', userExtractor, async (req: Request, res: Response) => {
  const user = req.user
  const receiptIdValues = user.receiptIds
  let values = []
  //!!!This could deffinitelly be done better than firing request for each id but for now it works
  for (let i = 0; i < receiptIdValues.length; i++) {
    const item = await getItem(receiptIdValues[i])
    values.push(item)
  }

  /*
  //This does not produce any results, even though syntax is correct
  const mappedValues = receiptIdValues.map(i => `"${i}"`).join(",")
  //The IN operator goes through string values in a form of "abc", "123", "ubn"
  const querySpec3 = {
    query: `SELECT * FROM receipts r WHERE r.id IN ${mappedValues}`,
    parameters: [
      { name: '@receiptIds', value: mappedValues }
    ]
  }
  //only the receipts where eAddressId matches
  const querySpec2 = {
    query: 'SELECT * FROM receipts r WHERE r.eAddressId = @userEAddress',
    parameters: [
      { name: '@userEAddress', value: user.eAddressId }
    ]
  }
  //original, finds all receipts
  const querySpec = {
    query: 'SELECT * FROM root'
  }

  //remember to use find from receiptDao, not userDao
  const values = await find(querySpec3)
  */

  res.json(values)
})

//get a single item by id
receiptsRouter.get('/:id', userExtractor, async (req: Request, res: Response) => {
  const user = req.user
  let item: Receipt

  //!!!Could be changed to an sql query
  if (!user.receiptIds.includes(req.params.id)) {
    return res.status(400).json({ error: 'user does not have access to given receiptId' })
  } else {
    item = await getItem(req.params.id)
  }

  if (!item) {
    return res.status(500).json({ error: 'database: receipt matching given id not found' })
  }

  res.json(item)
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
  const addedItem = await addItem(item)
  if (addedItem) {
    //updating the logged in user with the new receipt id
    await addToReceiptArray(user.id, addedItem.id)
  }

  res.redirect('/')
})

//tobeimplemented
/*
receiptsRouter.post('/sendreceipt/:eAddress', userExtractor, async (req: Request, res: Response) => {
  const querySpec = {
    query: 'SELECT DISTINCT FROM users u WHERE u.eAddressId = @eAddress',
    parameters: [
      { name: '@eAddress', value: req.params.eAddress }
    ]
  }
  const recipient: User = await find(querySpec)
})
*/

//deleteReceipt, not for production!!!
receiptsRouter.delete('/:id', async (req: Request, res: Response) => {
  let result = 'delete not allowed'
  if (process.env.NODE_ENV !== 'production') {

    //deleting the receiptId from all users receiptId arrays
    const check = await deleteReceiptFromAllUsers(req.params.id)
    //deleting the receipt from db
    if (!check) {
      return res.status(400).json({ error: 'removing receiptIds from users failed, deletion canceled' })
    }
    await deleteItem(req.params.id)

    result = `receipt ${req.params.id} successfully deleted`
  }
  res.json(result)
})

export { receiptsRouter }