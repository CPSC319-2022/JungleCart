import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { OrderController } from '../controllers'
class OrderRouter extends PathRouter {
  constructor() {
    const path = '/orders'
    const router = Router()
    super(path, router)
    router.post('/', asyncWrap(OrderController.addOrder))
    router.delete('/:id', asyncWrap(OrderController.deleteOrderById))
    router.get('/:id', asyncWrap(OrderController.getOrderInfoById))
    router.put('/:id', asyncWrap(OrderController.updateOrderInfoById))
    router.post('/:id/checkout', asyncWrap(OrderController.checkoutOrderById))
    router.get('/', asyncWrap(OrderController.getOrders))
  }
}
export default OrderRouter
