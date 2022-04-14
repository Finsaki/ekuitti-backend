import express from 'express'
require('express-async-errors')
const app = express()
//import cors from 'cors' //yarn add cors
import * as middleware from './utils/middleware'
import { helloRouter } from './controllers/hello'

import * as config from './utils/config'
import * as logger from './utils/logger'
import { TaskList } from './controllers/tasklist'
import { TaskDao } from './models/taskDao'
const CosmosClient = require('@azure/cosmos').CosmosClient

//------------stuff

//import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//--------connection to db here-------------
const cosmosClient = new CosmosClient({
    endpoint: config.HOST,
    key: config.AUTH_KEY
})
const taskDao = new TaskDao(cosmosClient, config.DB_ID, config.CONT_ID)
const taskList = new TaskList(taskDao)

try {
  taskDao.init()
} catch(err) {
  logger.error(err)
  logger.error('Shutting down because there was an error settinig up the database.')
  process.exit(1)
}

//--------middlewares here (other than error handling), before routers-------
//app.use(cors())
//app.use(express.json())
app.use(middleware.morgan(':method :url :status :res[content-length] :response-time ms :response-body'))

//--------routers here, (GET, POST, PUT..).---------
app.use('/api/hello', helloRouter)

app.get('/', (req, res, next) => taskList.showTasks(req, res).catch(next))
app.post('/addtask', (req, res, next) => taskList.addTask(req, res).catch(next))
app.post('/completetask', (req, res, next) =>
  taskList.completeTask(req, res).catch(next)
)

app.set('view engine', 'jade')

//--------API error handling here, errorhandler last-------
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export {app}
