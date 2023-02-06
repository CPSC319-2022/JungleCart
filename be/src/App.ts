import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { userRouter } from './routes/User.router'

dotenv.config()

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

// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello world!!!')
})
