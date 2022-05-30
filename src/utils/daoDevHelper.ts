import { Container } from '@azure/cosmos'
import { genRandomString, sha512 } from './hashHelper'
import * as logger from './logger'

const createUsers = async (userContainer: Container) => {
  logger.info('Populating users for testing...')
  const json = await import('../../docs/users.json')
  const users = json.default
  users.forEach(async (user) => {
    const salt = genRandomString(16)
    await userContainer.items.create({
      username: user.username,
      name: user.name,
      passwordData: {
        passwordHash: sha512(user.password, salt),
        salt: salt,
      },
      eAddressId: user.eAddressId,
    })
  })
  logger.info(`[${users.length}] users added`)
}

const createReceipts = async (receiptContainer: Container) => {
  logger.info('Populating receipts for testing...')
  const json = await import('../../docs/fake_receipts.json')
  const receipts = json.default
  receipts.forEach(async (receipt) => {
    await receiptContainer.items.create(receipt)
  })
  logger.info(`[${receipts.length}] receipts added`)
}

export { createUsers, createReceipts }