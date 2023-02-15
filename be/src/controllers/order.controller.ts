import e, { Request, Response } from 'express'
import {
  createOrder,
  findAllOrders,
  findAllOrderItmes,
  findOrderInfoById,
  deleteOrder,
  findOrderItmesByOrderId,
  findOrderInfoByBuyerId,
} from '../models/Order.model'
import { Order, Order_item } from '../utils/types'

export const listOrders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllOrders()
  return res.json(rst)
}

export const addOrder = async (req: Request, res: Response) => {
  console.log(req)
  const order: Order = req.body
  const user = createOrder(order)
  res.send(user)
}

export const getOrderInfoById = async (req: Request, res: Response) => {
  const rst = await findOrderInfoById(req.params['id'].slice(1))
  return res.json(rst)
}

export const getOrderInfoByBuyerId = async (req: Request, res: Response) => {
  const rst = await findOrderInfoByBuyerId(req.params['id'].slice(1))
  return res.json(rst)
}

export const listAllOrderItems = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllOrderItmes()
  return res.json(rst)
}

export const listOrderItmesByOrderId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findOrderItmesByOrderId(req.params['id'].slice(1))
  return res.json(rst)
}

// export const addOrderItem = async (req: Request, res: Response) => {
//   console.log(req)
//   const order_item: Order_item = req.body
//   const user = createOrderItem(order_item)
//   res.send(user)
// }

//TODO: create order

export const deleteOrderById = async (req: Request, res: Response) => {
  const rst = await deleteOrder(req.params['id'].slice(1))
  return res.json(rst)
}

// export const updateOrderInfoByOrderId = async (req: Request, res: Response) => {
//   const orderInfo: Order_combo = req.body
//   const rst = await editOrderById(req.params['id'].slice(1), orderInfo)
//   return res.json(rst)
// }
