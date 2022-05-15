import { Request, Response } from 'express'
import morgan from 'morgan'
import * as logger from './logger'

//This file contains helper functions which are used in response to API calls

//setting up a custom morgan token that shows the request body data when the operation is a POST operation
// eslint-disable-next-line no-unused-vars
morgan.token('response-body', function (req: Request, res: Response) {
  if (req.method === 'POST') {
    if (req.body.password) {
      req.body.password = '****'
    }
    return JSON.stringify(req.body)
  }
  return null
})

//will return json message instead of default 404
const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: Error, _req: Request, res: Response, next: any) => {
  //Define spesific errors here to get custom error messages
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })

  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })

  } else if (error.name === 'Error'
      && error.message.startsWith('Entity with the specified id already exists in the system')){
    return res.status(500).json({ error: 'database: values must be unique' })

  } else if (error.name === 'Error'
      && error.message.startsWith('Entity with the specified id does not exist in the system')){
    return res.status(500).json({ error: 'database: values matching given id not found' })

  } else if (error.name === 'SomeOtherError') {
    return res.status(400).json({ error: error.message })
  }

  //print out the whole error message
  //move this before the spesified errors if want to see full messages
  logger.error(error.message)

  next(error)
}

export {
  morgan,
  unknownEndpoint,
  errorHandler
}
