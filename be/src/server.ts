import express, { Application } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { userRouter } from './routes/User.router'
import { sellerRouter } from './routes/Seller.router'
import { buyerRouter } from './routes/Buyer.router'
import { adminRouter } from './routes/Admin.router'
import { orderRouter } from './routes/Order.router'
import { productRouter } from './routes/Product.router'
import { cartRouter } from './routes/Cart.router'
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
    this.app.use(sellerRouter)
    this.app.use(orderRouter)
    this.app.use(productRouter)
    this.app.use(buyerRouter)
    this.app.use(cartRouter)
    this.app.use(adminRouter)
  }
}
