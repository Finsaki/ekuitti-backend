import { Request, Response, Router } from 'express'
import { Receipts } from '../models/receipt'
import { find, addItem, getItem, deleteItem } from '../models/receiptDao'
import { addToReceiptArray, deleteFromReceiptArray } from '../models/userDao'
import { userExtractor } from '../utils/middleware'

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
receiptsRouter.get('/', async (_req: Request, res: Response) => {
  const querySpec = {
    query: 'SELECT * FROM root',
  }
  const items = await find(querySpec)
  res.json(items)
})

//get a single item by id
receiptsRouter.get('/:id', async (req: Request, res: Response) => {
  const item = await getItem(req.params.id)
  if (!item) {
    return res.status(500).json({ error: 'database: values matching given id not found' })
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

/* tobeimplemented
receiptsRouter.post('/sendreceipt', userExtractor, async (req: Request, res: Response) => {
})
*/

//deleteReceipt, not for production!!!
receiptsRouter.delete('/:id', userExtractor, async (req: Request, res: Response) => {
  let result = 'delete not allowed'
  if (process.env.NODE_ENV !== 'production') {
    const user = req.user

    //deleting the receipt from db
    await deleteItem(req.params.id)
    //deleting the receiptId from users receiptId array
    await deleteFromReceiptArray(user.id, req.params.id)

    result = `receipt ${req.params.id} successfully deleted`
  }
  res.json(result)
})

export { receiptsRouter }