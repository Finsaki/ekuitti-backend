import { Request, Response, Router } from 'express';

const receiptsRouter = Router();

type Receipts = Receipt[]

type Receipt = {
    date: string,
    company: {
        name: string,
        "business-id": string,
        "vat-id": string, 
        address: {
            street: string,
            city: string,
            "postal-code": string,
            country: string
        }
    },
    products: Product[],
    currency: string,
    "total-price-excl-vat": number,
    "vat-10"?: number,
    "vat-14"?: number,
    "vat-24"?: number,
    "total-vat": number,
    "total-price": number,
    "meta-data"?: {
        [key: string]: any
    }
}

type Product = {
    name: string,
    quantity: number,
    unit: string,
    "unit-price": number,
    "price-total": number,
    "vat": number,
    "unit-vat":  number,
    "vat-total": number
}

receiptsRouter.get("/", async (_req: Request, res: Response) => {
    const json = await import("../../docs/receipts.json") // import local json file for testing
    const data: Receipts = json.default //.default gets the actual data
    res.json(data)
})

export { receiptsRouter }