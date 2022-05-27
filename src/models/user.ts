type User = {
  username: string,
  name: string,
  passwordData: {
    passwordHash: string,
    salt: string
  },
  eAddressId: string
}

type Users = User[]

export { Users, User }