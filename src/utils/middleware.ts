import { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import * as logger from './logger'
import { verify, JwtPayload } from 'jsonwebtoken'
import { getItem } from '../models/userDao'
import { parseCookies } from './cookieHelper'

/**
 * This file contains helper functions which are used in response to API calls
 */

//setting up a custom morgan token that shows the request body data when the operation is a POST operation
morgan.token('response-body', function (req: Request) {
  if (req.method === 'POST') {
    if (req.body.password) req.body.password = '****'
    return JSON.stringify(req.body)
  }
  return null
})

//will return json message instead of default 404
const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

//This adds the user as a new field to a request for easy access from anywhere in the app
const userExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //checking that token field in request matches decodedToken with envSecret value
  const decodedToken = verify(req.token, process.env.SECRET) as JwtPayload // Tell tsc that token is a jwtpayload not a string

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await getItem(decodedToken.id)
  //all id's are used for verification processes
  req.user = {
    id: user.id,
    eAddressId: user.eAddressId,
  }

  next()
}

//extract the token and save it to Request on a form that can be compared in backend
const tokenExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.headers.cookie
  if (cookies && cookies.includes('token=')) {
    const parsedCookies = parseCookies(cookies)
    const tokenCookie = parsedCookies.token
    req.token = tokenCookie
  } else {
    req.token = null
  }
  next()
}

//Will catch specific error codes/messages and output more understandable error messages
const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  //Define spesific errors here to get custom error messages
  switch (error.name) {
    case 'JsonWebTokenError': {
      return res.status(401).json({ error: 'invalid token' })
    }
    case 'TokenExpiredError': {
      return res.status(401).json({ error: 'token expired' })
    }
    case 'Error': {
      if (
        error.message.startsWith(
          'Entity with the specified id already exists in the system'
        )
      ) {
        return res
          .status(500)
          .json({ error: 'database: values must be unique' })
      } else if (
        error.message.startsWith(
          'Entity with the specified id does not exist in the system'
        )
      ) {
        return res
          .status(500)
          .json({ error: 'database: values matching given id not found' })
      }
      break
    }
  }

  //print out the whole error message
  //move this before the specified errors if want to see full messages
  logger.error(error.message)

  next(error)
}

export { morgan, unknownEndpoint, errorHandler, userExtractor, tokenExtractor }
