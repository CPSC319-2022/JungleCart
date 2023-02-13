import express, { Request, Response } from 'express'
import {
  listOrders,
  addOrder,
  listOrderItems,
  addOrderItem,
} from '../controllers/order.controller'

export const orderRouter = express.Router()

orderRouter.route('/').get((req: Request, res: Response) => res.json('welcome'))

orderRouter.route('/orders').get(listOrders)
orderRouter.post('/orders/post', addOrder)
orderRouter.route('/orderItems').get(listOrderItems)
orderRouter.post('/orderItems/post', addOrderItem)
