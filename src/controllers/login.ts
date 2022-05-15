import { Request, Response, Router } from 'express'
import crypto from 'crypto'
import { find } from '../models/userDao'
import jwt from 'jsonwebtoken'


const loginRouter = Router()

loginRouter.post('/', async (req: Request, res: Response) => {
  const body = req.body

  const querySpec = {
    query: 'SELECT * FROM users u WHERE u.username = @username',
    parameters: [
      { name: '@username', value: body.username }
    ]
  }

  //CosmosDB returns queries in arrays
  const userItemArray = await find(querySpec)

  //This should not be possible but adding incase of manual changes to db
  //createUserContainer method in daoHelper class enforces unique usernames
  if (userItemArray.length > 1) {
    return res.status(401).json({
      error: 'more than one user with given username found'
    })
  }

  const userItem = userItemArray[0]

  const loginPasswordHash = crypto.createHash('sha256')
    .update(body.password)
    .digest('hex')

  const sameError = 'invalid username or password'
  //Checking if userItem is not null and if passwordhashes match
  if (!userItem) {
    return res.status(401).json({
      error: sameError
    })
  } else if (userItem.passwordHash !== loginPasswordHash) {
    return res.status(401).json({
      error: sameError
    })
  }

  const userForToken = {
    username: userItem.username,
    id: userItem.id
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 })

  res
    .status(200)
    .send({ token, username: userItem.username, name: userItem.name })
})

export { loginRouter }
