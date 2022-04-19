//Contains necessary variables for database connection

import { config } from 'dotenv'
config()

let PORT = process.env.PORT || '8000'
let AUTH_KEY = process.env.DB_SECRET_KEY
let DB_ID = "ToDoList"; //Name of the database
let CONT_ID = "Items"; //Name of the container

//this will check if test environment is in use and switch the database accordingly
let HOST = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URI
  : process.env.DB_URI

export { HOST, PORT, AUTH_KEY, DB_ID, CONT_ID }