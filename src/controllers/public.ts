import { Request, Response, Router } from 'express'
import { Receipt } from '../models/receipt'
import { addItem } from '../models/receiptDao'

/**
 * Routes which use public API endpoints
 */

const publicRouter = Router()

//Creates a new receipt to database using public API
publicRouter.post('/receipts', async (req: Request, res: Response) => {
  const item: Receipt = req.body

  if (item.eAddressId &&
      item.merchant &&
      item.products &&
      item.vats &&
      item.totalPriceExcVAT &&
      item.totalPriceIncVAT &&
      item.totalVATAmount) {

    //adding the receipt to database
    await addItem(item)
    res.status(201).json('success')
  } else {
    return res.status(400).json({ error: 'receipt data is invalid' })
  }
})

//This is simply for testing the public API connection
publicRouter.get('/receipts', async (req: Request, res: Response) => {
  return res.json('success')
})

export { publicRouter }