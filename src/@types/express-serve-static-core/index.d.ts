//This allows express request to have modified fields
//file location is important for typescript
//tscongig.json needs "typeRoots": ["./src/@types","./node_modules/@types",] added

type UserValues = {
  id: string,
  eAddressId: string,
  receiptIds: string[]
}

//if any importing is done then the following needs to be wrapped in declare global {}
//see: https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
//Nov 10, 2020 by David D.

declare namespace Express { // eslint-disable-line no-unused-vars
  interface Request { // eslint-disable-line no-unused-vars
    user?: UserValues
    token?: string
  }
}