import express from 'express'
import 'express-async-errors'
const app = express()
import cors from 'cors'
import * as config from './utils/config'
import * as logger from './utils/logger'
import * as middleware from './utils/middleware'
import { CosmosClient } from '@azure/cosmos'
import { init } from './utils/daoHelper'
import { taskRouter } from './controllers/tasks'
import { receiptsRouter } from './controllers/receipts'
import { usersRouter } from './controllers/users'
import { loginRouter } from './controllers/login'

//--------connection to db here-------------
const cosmosClient = new CosmosClient({
  endpoint: config.HOST,
  key: config.AUTH_KEY,
})

try {
  init(cosmosClient)
} catch (err) {
  logger.error(err)
  logger.error(
    'Shutting down because there was an error settinig up the database.'
  )
  process.exit(1)
}

//--------middlewares here (other than error handling), before routers-------
app.use(cors({ credentials: true, origin: config.FRONTURI }))
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(
  middleware.morgan(
    ':method :url :status :res[content-length] :response-time ms :response-body'
  )
)

//--------routers here, (GET, POST, PUT..).---------
app.use('/api/tasks', taskRouter) //testing with db
app.use('/api/receipts', receiptsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

//--------API error handling here, errorhandler last-------
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export { app }
