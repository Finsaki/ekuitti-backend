type Receipts = Receipt[]

type Receipt = {
  id?: string // Azure item ID
  receiptTimeStamp: string
  merchant: {
    name: string
    companyID: string
    branch: {
      name: string
      address: {
        streetAddress: string
        city: string
        zipCode: string
        country: string
      }
    }
  }
  products: Product[]
  currencyISOCode: string
  totalPriceExcVAT: number
  vats: VAT[]
  totalVATAmount: number
  totalPriceIncVAT: number
  metaData?: {
    [key: string]: any
  }
}

type Product = {
  name: string
  quantity: number
  quantityCode: string
  unitPriceIncVAT: number
  totalAmountExcVAT: number
  totalAmountIncVAT: number
  vats: VAT[]
}

type VAT = {
  VATRate: number
  VATAmount: number
  totalAmountExcVAT: number
  totalAmountIncVAT: number
}

export type { Product, Receipt, Receipts }
