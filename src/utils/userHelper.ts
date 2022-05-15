import { Users, User } from '../models/user'

const removePasswordForUsers = async (users: Users) => {
  if (users) {
    users.forEach((user) => {
      delete user.passwordHash
    })
  }
}

const removePasswordForUser = async (user: User) => {
  if (user) {
    delete user.passwordHash
  }
}

export { removePasswordForUsers, removePasswordForUser }