import { Users, User } from '../models/user'

const removePasswordForUsers = async (users: Users) => {
  users.forEach((user) => {
    delete user.passwordHash
  })
}

const removePasswordForUser = async (user: User) => {
  delete user.passwordHash
}

export { removePasswordForUsers, removePasswordForUser }