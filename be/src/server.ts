import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { userRouter } from './routes/User.router'
import { connection } from './utils/db'

dotenv.config()
export default class server {
  private app: Application
  private port = process.env.PORT || 8080

  constructor() {
    this.app = express()
    this.middleware()
    this.routers()
  }

  middleware() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  async listen() {
    await this.app.listen(8080)
    console.log('server on port', this.port)
  }

  routers() {
    this.app.use(userRouter)
    this.app.use(userRouter)
    this.app.use(userRouter)
    this.app.use(userRouter)
    this.app.use(userRouter)
  }
}
