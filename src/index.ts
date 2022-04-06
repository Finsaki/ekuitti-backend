import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import { rootHandler, helloHandler } from './handlers'

//setting up a custom morgan token that shows the request body data when the operation is a POST operation
morgan.token('response-body', function (req, res) {
  if (req.method === 'POST') {
    //@ts-ignore
    return JSON.stringify(req.body)
  }
  return null
})

const app = express()
const port = process.env.PORT || '8000'

app.use(express.json())
//setting up morgan with custom console message that shows when CRUD operations are used
app.use(morgan(':method :url :status :res[content-length] :response-time ms :response-body'))

app.get('/', rootHandler)
app.get('/hello/:name', helloHandler)

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})