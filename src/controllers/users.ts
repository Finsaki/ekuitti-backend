import { Request, Response, Router } from 'express'
import { Users, User } from '../models/user'
import { find, addItem, getItem, deleteItem } from '../models/userDao'
import {
  removePasswordForUsers,
  removePasswordForUser,
} from '../utils/userHelper'
import { genRandomString, sha512 } from '../utils/hashHelper'

/**
 * This class connects the API endpoints and database CRUD operations from model
 * class userDao.ts
 */

const usersRouter = Router()

//testUser without database connection
/* usersRouter.get('/test', async (_req: Request, res: Response) => {
  const json = await import('../../docs/users.json') // import local json file for testing
  const data: Users = json.default //.default gets the actual data
  await removePasswordForUsers(data)
  res.json(data)
}) */

usersRouter.get('/', async (_req: Request, res: Response) => {
  const querySpec = {
    query: 'SELECT * FROM root',
  }
  const items = await find(querySpec)
  await removePasswordForUsers(items)
  res.json(items)
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

usersRouter.post('/adduser', async (req: Request, res: Response) => {
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
    receiptIds: [],
    passwordData: {
      passwordHash: passwordHash,
      salt: salt,
    },
    eAddressId: item.eAddressId,
  }

  await addItem(newUser)

  res.redirect('/')
})

//delete User with id
usersRouter.delete('/:id', async (req: Request, res: Response) => {
  const result = await deleteItem(req.params.id)
  res.json(result)
})

export { usersRouter }
