require('dotenv').config()

let PORT = process.env.PORT || '8000'
//this will check if test environment is in use and switch the database accordingly
let DB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URI
  : process.env.DB_URI

export { DB_URI, PORT }