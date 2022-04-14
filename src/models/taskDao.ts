import { Database, Container, SqlQuerySpec, CosmosClient } from "@azure/cosmos"
import * as logger from '../utils/logger'

// @ts-check
//const { CosmosClient } = require('@azure/cosmos').CosmosClient

// For simplicity we'll set a constant partition key
const partitionKey: string = undefined

type Item = {date: number, completed: boolean}

/**
 * Manages reading, adding, and updating Tasks in Cosmos DB
 */
class TaskDao {
  private client: CosmosClient
  private databaseId: string
  private collectionId: string
  private database: Database
  private container: Container

  constructor(cosmosClient: CosmosClient, databaseId: string, containerId: string) {
    this.client = cosmosClient
    this.databaseId = databaseId
    this.collectionId = containerId

    this.database = null
    this.container = null
  }

  async init() {
    logger.info('Setting up the database...')
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId
    })
    this.database = dbResponse.database
    logger.info('Setting up the database...done!')
    logger.info('Setting up the container...')
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId
    })
    this.container = coResponse.container
    logger.info('Setting up the container...done!')
  }

  async find(querySpec: SqlQuerySpec) {
    logger.debug('Querying for items from the database')
    if (!this.container) {
      throw new Error('Collection is not initialized.')
    }
    const { resources } = await this.container.items.query(querySpec).fetchAll()
    return resources
  }

  async addItem(item: Item) {
    logger.debug('Adding an item to the database')
    item.date = Date.now()
    item.completed = false
    const { resource: doc } = await this.container.items.create(item)
    return doc
  }

  async updateItem(itemId: string) {
    logger.debug('Update an item in the database')
    const doc = await this.getItem(itemId)
    doc.completed = true

    const { resource: replaced } = await this.container
      .item(itemId, partitionKey)
      .replace(doc)
    return replaced
  }

  async getItem(itemId: string) {
    logger.debug('Getting an item from the database')
    const { resource } = await this.container.item(itemId, partitionKey).read()
    return resource
  }
}

export { TaskDao } 