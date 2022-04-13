//Contains helper functions which are used in response to API calls

import { Request, Response } from 'express';
import morgan from 'morgan'
import * as logger from './logger'

//setting up a custom morgan token that shows the request body data when the operation is a POST operation
morgan.token('response-body', function (req: Request, res: Response) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return null
})

//will return json message instead of default 404
const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: Error, _req: Request, res: Response, next: any) => {
  logger.error(error.message)

  //Define spesific errors here to get custom error messages
  if (error.name === 'SomeError') {
    return res.status(400).send({ error: 'unique error message' })

  } else if (error.name === 'SomeOtherError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

export {
  morgan,
  unknownEndpoint,
  errorHandler
}
  