import { Request, Response, Router } from 'express'
import { findUser } from '../models/userDao'
import { sha512 } from '../utils/hashHelper'
import jwt from 'jsonwebtoken'


const loginRouter = Router()

loginRouter.post('/', async (req: Request, res: Response) => {
  const body = req.body
  //same error is returned in bot bad username and bad password cases so no information is given by accident
  const sameError = 'invalid username or password'

  const querySpec = {
    query: 'SELECT * FROM users u WHERE u.username = @username',
    parameters: [
      { name: '@username', value: body.username }
    ]
  }

  //finding a user with username
  const userItem = await findUser(querySpec)

  //Checking if userItem is not null
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
