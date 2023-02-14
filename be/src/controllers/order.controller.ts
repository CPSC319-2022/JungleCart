import e, { Request, Response } from 'express'
import {
  createOrder,
  findAllOrders,
  findAllOrderItmes,
  createOrderItem,
} from '../models/Order.model'

export const listOrders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllOrders()
  return res.json(rst)
}

export const addOrder = async (req: Request, res: Response) => {
  console.log(req)
  const { buyer_id, status } = req.body
  const user = createOrder(buyer_id, status)
  res.send(user)
}

export const listOrderItems = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllOrderItmes()
  return res.json(rst)
}

export const addOrderItem = async (req: Request, res: Response) => {
  console.log(req)
  const { order_id, product_id, shippings, quantity } = req.body
  const user = createOrderItem(order_id, product_id, shippings, quantity)
  res.send(user)
}
