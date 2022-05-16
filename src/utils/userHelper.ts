import { Users, User } from '../models/user'

const removePasswordForUsers = async (users: Users) => {
  if (users) {
    users.forEach((user) => {
      delete user.passwordData
    })
  }
}

const removePasswordForUser = async (user: User) => {
  if (user) {
    delete user.passwordData
  }
}

export { removePasswordForUsers, removePasswordForUser }