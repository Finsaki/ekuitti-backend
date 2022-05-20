type Receipt = {
  // Azure item ID
  id?: string

  // eAddress that identifies the original buyer
  eAddressId: string

  //used receipt data
  receiptTimeStamp: string
  merchant: Merchant
  products: Product[]
  currencyISOCode: string
  totalPriceExcVAT: number
  totalVATAmount: number
  totalPriceIncVAT: number
  vats: TotalVAT[]

  //unused/optional receipt data
  receiptNumber?: string
  payments?: Payment[]
}

type Merchant = {
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

type Product = {
  //used product data
  name: string
  quantity: string //string because different ways given: 1, 1,00, 4.25...
  quantityCode: string //kpl, KPL...
  unitPriceIncVAT: number
  totalAmountExcVAT: number
  totalAmountIncVAT: number
  vats: VAT[]

  //unused/optional product data
  EANCode?: string
  productId?: string
  freeText?: string
  discounts?: Discount[]
  unitPriceIncVATDecimal?: string //not included in every product
}

type TotalVAT = {
  VATRate: string
  totalAmountExcVAT: number
  totalAmountIncVAT: number
  totalVATAmount: number
}

type VAT = {
  VATRate: string
  totalAmountExcVAT: number
  totalAmountIncVAT: number
  VATAmount: number
}

type Payment = {
  type: string,
  amount: number,
  attributes: {
    cardType: string,
    timeStamp: string,
    terminalId: string,
    referenceNumber: string,
    authorizationCode: string,
    transactionId: string,
    maskedPAN: string
  }
}

type Discount = {
  amount: number
  description: string
  percentage?: string //not included in every discount
}

type Receipts = Receipt[]

export type { Receipts, Receipt, Product }