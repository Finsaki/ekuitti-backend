type User = {
  username: string,
  name: string,
  passwordHash: string,
  receiptIds: string[],
  eAddressId: string
}

type Users = User[]

export { Users, User }