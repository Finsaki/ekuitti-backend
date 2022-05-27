import { Request, Response, Router } from 'express'
import { findUsers } from '../models/userDao'
import { sha512 } from '../utils/hashHelper'
import jwt from 'jsonwebtoken'


const loginRouter = Router()

loginRouter.post('/', async (req: Request, res: Response) => {
  const body = req.body
  const sameError = 'invalid username or password'

  const querySpec = {
    query: 'SELECT * FROM users u WHERE u.username = @username',
    parameters: [
      { name: '@username', value: body.username }
    ]
  }

  //CosmosDB returns queries in arrays
  const userItemArray = await findUsers(querySpec)

  //This should not be possible but adding incase of manual changes to db
  //createUserContainer method in daoHelper class enforces unique usernames
  if (userItemArray.length > 1) {
    return res.status(500).json({
      error: 'database: more than one user with given username found'
    })
  }

  //taking the first and only item from array
  const userItem = userItemArray[0]

  //Checking if userItem is not null and if passwordhashes match
  if (!userItem) {
    return res.status(401).json({
      error: sameError
    })
  }

  //creating a new hash based on the password provided by request and salt from user in database
  const loginPasswordHash = sha512(body.password, userItem.passwordData.salt)

  //Checking if passwordhashes match
  if (userItem.passwordData.passwordHash !== loginPasswordHash) {
    return res.status(401).json({
      error: sameError
    })
  }

  //used for unique jwt token signature
  const userForToken = {
    username: userItem.username,
    id: userItem.id
  }

  //creating a token to be used to verify sessions and authorization
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  //returning successcode and token + username and name of user to be used in frontend
  res
    .status(200)
    .send({ token, username: userItem.username, name: userItem.name })
})

export { loginRouter }
