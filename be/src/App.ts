import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/User.router'
import { connect } from './utils/db'

dotenv.config()

const PORT: number = parseInt(process.env.PORT as string, 10) || 3306
if (!process.env.PORT) {
  process.exit(1)
}
const app = express()
app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
  connect()
  router(app)
})
