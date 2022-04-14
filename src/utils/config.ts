require('dotenv').config()

let PORT = process.env.PORT || '8000'
let AUTH_KEY = process.env.DB_SECRET_KEY
let DB_ID = "ToDoList";
let CONT_ID = "Items";

//this will check if test environment is in use and switch the database accordingly
let HOST = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URI
  : process.env.DB_URI

export { HOST, PORT, AUTH_KEY, DB_ID, CONT_ID }