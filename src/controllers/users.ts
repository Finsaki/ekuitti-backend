import { Request, Response, Router } from 'express'
import bcrypt from 'bcryptjs'
import { Users, User } from '../models/user'
import { find, addItem, getItem, deleteItem } from '../models/userDao'
import { removePasswordForUsers, removePasswordForUser } from '../utils/userHelper'

/**
 * This class connects the API endpoints and database CRUD operations from model
 * class userDao.ts
 */

const usersRouter = Router()

//testUser without database connection
usersRouter.get('/test', async (_req: Request, res: Response) => {
  const json = await import('../../docs/users.json') // import local json file for testing
  const data: Users = json.default //.default gets the actual data
  await removePasswordForUsers(data)
  res.json(data)
})

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
  } else if (item.name.length === undefined) {
    item.name = 'User'
  }

  if (item.eAddressId === undefined) {
    return res.status(400).json({ error: 'e-Address missing' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(item.password, saltRounds)

  const newUser: User = {
    username: item.username,
    name: item.name,
    receiptIds: [],
    passwordHash: passwordHash,
    eAddressId: item.eAddressId
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