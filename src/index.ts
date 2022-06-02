import { app } from './app'
import * as http from 'http'
import * as logger from './utils/logger'
import * as config from './utils/config'

//creates a http server to start receiving requests
const server = http.createServer(app)

server.listen(config.PORT, () => {
  return logger.info(`Server is listening on ${config.PORT}`)
})