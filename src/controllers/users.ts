import { Request, Response, Router } from 'express'
import { User } from '../models/user'
import { addItem, getItem, deleteItem } from '../models/userDao'
import { removePasswordForUser } from '../utils/userHelper'
import { genRandomString, sha512 } from '../utils/hashHelper'
import { userExtractor } from '../utils/middleware'

/**
 * Connects the API endpoints and database CRUD operations from src/model/userDao.ts
 */

const usersRouter = Router()

// Get a user profile
// TODO: probably want to remove password hash and salt from response
usersRouter.get('/', userExtractor, async (req: Request, res: Response) => {
  const user = await getItem(req.user.id)
  res.status(200).json(user)
})

//get a single item by id
usersRouter.get('/:id', async (req: Request, res: Response) => {
  const item = await getItem(req.params.id)
  if (!item) {
    return res
      .status(500)
      .json({ error: 'database: values matching given id not found' })
  }
  await removePasswordForUser(item)
  res.json(item)
})

//create a new user
usersRouter.post('/', async (req: Request, res: Response) => {
  const item = req.body

  //check here if password is acceptable, item.password comes from frontend
  if (item.password === undefined) {
    return res.status(400).json({ error: 'password missing' })
  } else if (item.password.length < 3) {
    return res.status(400).json({ error: 'password too small' })
  }

  if (item.username === undefined) {
    return res.status(400).json({ error: 'username missing' })
  }

  if (item.eAddressId === undefined) {
    return res.status(400).json({ error: 'e-Address missing' })
  }

  if (item.name === undefined) {
    item.name = 'User'
  }

  //Creating the passwordhash and salt with hashHelper class
  const salt = genRandomString(16)
  const passwordHash = sha512(item.password, salt)

  const newUser: User = {
    username: item.username,
    name: item.name,
    passwordData: {
      passwordHash: passwordHash,
      salt: salt,
    },
    eAddressId: item.eAddressId,
  }

  await addItem(newUser)

  res.status(201).json('success')
})

//delete User with id
usersRouter.delete('/:id', async (req: Request, res: Response) => {
  const result = await deleteItem(req.params.id)
  res.json(result)
})

/*
//changeUserName
usersRouter.put('/:id', async (req: Request, res: Response) => {
  const result = await updateItemName(req.params.id, req.body.name)
  res.json(result)
})
*/

export { usersRouter }
