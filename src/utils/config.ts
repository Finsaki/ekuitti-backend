import { config } from 'dotenv'
config()

//Contains necessary variables for database connection

const PORT = process.env.PORT || '8000'

//E-receipt db
const PRIMARY_DB_ID = 'cosmos-e-receipts' //Name of the database for receipts
const RECEIPT_CONT_ID = 'receipts' //Name of the receipts container
const USER_CONT_ID = 'users' //Name of the users container

//Secondary db, put experimental stuff here
const SECONDARY_DB_ID = 'ToDoList'
const ITEM_CONT_ID = 'Items'

//this will check if test environment is in use and switch the database accordingly
const HOST = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URI
  : process.env.DB_URI

//this will check if test environment is in use and switch the secret key accordingly
const AUTH_KEY = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_SECRET_KEY
  : process.env.DB_SECRET_KEY

//export { HOST, PORT, AUTH_KEY, DB_ID, CONT_ID }
export {
  HOST, PORT, AUTH_KEY,
  PRIMARY_DB_ID, RECEIPT_CONT_ID, USER_CONT_ID,
  SECONDARY_DB_ID, ITEM_CONT_ID
}