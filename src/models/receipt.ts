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

export { Receipt, Product }