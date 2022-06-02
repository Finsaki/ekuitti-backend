import { Container } from '@azure/cosmos'
import { genRandomString, sha512 } from './hashHelper'
import * as logger from './logger'

/**
 * Used by development environment to generate userdata from json file
 * @param userContainer Azure cosmos db container where the users will be saved
 */

const createUsers = async (userContainer: Container) => {
  logger.info('Populating users for testing...')
  const json = await import('../../docs/demo/demo_users.json')
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

/**
 * Used by development environment to generate receiptdata from json file
 * @param receiptContainer Azure cosmos db container where the receipts will be saved
 */

const createReceipts = async (receiptContainer: Container) => {
  logger.info('Populating receipts for testing...')
  const json = await import('../../docs/demo/demo_receipts.json')
  const receipts = json.default
  receipts.forEach(async (receipt) => {
    await receiptContainer.items.create(receipt)
  })
  logger.info(`[${receipts.length}] receipts added`)
}

export { createUsers, createReceipts }