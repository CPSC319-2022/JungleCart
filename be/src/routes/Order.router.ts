import express, { Request, Response, Router } from 'express'
import {
  listOrders,
  addOrder,
  listAllOrderItems,
  getOrderInfoById,
  deleteOrderById,
  // updateOrderInfoByOrderId,
  listOrderItmesByOrderId,
  getOrderInfoByBuyerId,
} from '../controllers/order.controller'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'

export const orderRouter = Router()

// class OrderRouter extends PathRouter {
// constructor() {
// const path = '/orders'
// const orderRouter = Router()
// super(path, router)
orderRouter.get('/', asyncWrap(listOrders))
orderRouter.get('/:id', asyncWrap(getOrderInfoById))
orderRouter.get('/buyer/:id', asyncWrap(getOrderInfoByBuyerId))
orderRouter.post('/', asyncWrap(addOrder))
// orderRouter.delete('/:id', asyncWrap(deleteOrderById))
// orderRouter.put('/:id', asyncWrap(updateOrderInfoByOrderId))
// orderRouter.post('/:id/checkout', asyncWrap(checkoutOrderById))
//   }
// }
// export default OrderRouter

// order Items
orderRouter.get('/item/items', listAllOrderItems)
orderRouter.get('/items/:id/', listOrderItmesByOrderId)
