import { Request, Response } from 'express'
import morgan from 'morgan'
import * as logger from './logger'
import jwt from 'jsonwebtoken'
import { getItem } from '../models/userDao'

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

//This adds the user as a new field to a request for easy access from anywhere in the app
const userExtractor = async (req: Request, res: Response, next: any) => {
  //checking that token field in request matches decodedToken with envSecret value
  const decodedToken: any = jwt.verify(req.headers.cookie, process.env.SECRET)
  if (!req.headers.cookie || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await getItem(decodedToken.id)
  //all id's are used for verification processes
  req.user = {
    id: user.id,
    eAddressId: user.eAddressId,
    receiptIds: user.receiptIds
  }
  next()
}

const errorHandler = (error: Error, _req: Request, res: Response, next: any) => {
  //Define spesific errors here to get custom error messages
  switch (error.name) {
    case 'JsonWebTokenError': {
      return res.status(401).json({ error: 'invalid token' })
    }
    case 'TokenExpiredError': {
      return res.status(401).json({ error: 'token expired' })
    }
    case 'Error': {
      if (error.message.startsWith('Entity with the specified id already exists in the system')) {
        return res.status(500).json({ error: 'database: values must be unique' })

      } else if (error.message.startsWith('Entity with the specified id does not exist in the system')) {
        return res.status(500).json({ error: 'database: values matching given id not found' })
      }
      break
    }
  }

  //print out the whole error message
  //move this before the specified errors if want to see full messages
  logger.error(error.message)

  next(error)
}

export {
  morgan,
  unknownEndpoint,
  errorHandler,
  userExtractor
}
