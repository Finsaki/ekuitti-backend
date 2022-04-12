import { app } from './app'
import * as http from 'http'
import * as logger from './utils/logger'
import * as config from './utils/config'

const server = http.createServer(app)

app.listen(config.PORT, () => {
  return logger.info(`Server is listening on ${config.PORT}`)
})