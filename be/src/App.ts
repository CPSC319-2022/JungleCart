import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { userRouter } from './routes/User.router'
dotenv.config()

// const serverless = require('serverless-http')
if (!process.env.PORT) {
  process.exit(1)
}

const PORT: number = parseInt(process.env.PORT as string, 10)
const app: Application = express()
app.use(cors())
app.use(express.json())
app.use('/api/users', userRouter)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Hello world!!!')
})

// const handler = serverless(app, { provider: 'aws' })
// module.exports.funcName = async (context, req) => {
//   context.res = await handler(context, req)
// }

module.exports = app
