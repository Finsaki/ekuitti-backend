//Contains necessary variables for database connection

import { config } from 'dotenv'
config()

const PORT = process.env.PORT || '8000'
const AUTH_KEY = process.env.DB_SECRET_KEY
//Development conf
const DEV_DB_ID = 'cosmos-receipts-dev' //Name of the development database
const RECEIPT_CONT_ID = 'receipts' //Name of the receipts container
const USER_CONT_ID = 'users' //Name of the users container
//Test conf
const TEST_DB_ID = 'ToDoList' //OLD
const ITEM_CONT_ID = 'Items' //OLD

//this will check if test environment is in use and switch the database accordingly
const HOST = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URI
  : process.env.DB_URI

//export { HOST, PORT, AUTH_KEY, DB_ID, CONT_ID }
export {
  HOST, PORT, AUTH_KEY,
  DEV_DB_ID, RECEIPT_CONT_ID, USER_CONT_ID,
  TEST_DB_ID, ITEM_CONT_ID
}