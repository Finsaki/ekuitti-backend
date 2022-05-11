import { Request, Response, Router } from 'express'
import { Receipts } from '../models/receipt'
import { find, addItem, getItem, deleteItem } from '../models/receiptDao'

/**
 * This class connects the API endpoints and database CRUD operations from model
 * class receiptDao.ts
 */

const receiptsRouter = Router()

//testReceipt without database connection
receiptsRouter.get('/test', async (_req: Request, res: Response) => {
  const json = await import('../../docs/receipts.json') // import local json file for testing
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
  res.json(item)
})

//addReceipt
receiptsRouter.post('/addreceipt', async (req: Request, res: Response) => {
  const item = req.body

  await addItem(item)
  res.redirect('/')
})

//deleteReceipt, not for production
receiptsRouter.delete('/:id', async (req: Request, res: Response) => {
  let result = 'delete not allowed'
  if (process.env.NODE_ENV !== 'production') {
    result = await deleteItem(req.params.id)
  }
  res.json(result)
})

export { receiptsRouter }