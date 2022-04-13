import express from 'express'
require('express-async-errors')
const app = express()
//import cors from 'cors' //yarn add cors
import * as middleware from './utils/middleware'
import { helloRouter } from './controllers/hello'

//--------connection to db here-------------


//--------middlewares here (other than error handling), before routers-------
//app.use(cors())
app.use(express.json())
app.use(middleware.morgan(':method :url :status :res[content-length] :response-time ms :response-body'))

//--------routers here, (GET, POST, PUT..).---------
app.use('/api/hello', helloRouter)

//--------API error handling here, errorhandler last-------
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export {app}
