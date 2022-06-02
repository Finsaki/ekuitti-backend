import { Users, User } from '../models/user'

//removes passwords for a list of users
const removePasswordForUsers = async (users: Users) => {
  if (users) {
    users.forEach((user) => {
      delete user.passwordData
    })
  }
}

//removes password for a single user
const removePasswordForUser = async (user: User) => {
  if (user) {
    delete user.passwordData
  }
}

export { removePasswordForUsers, removePasswordForUser }