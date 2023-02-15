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
    router.delete('/:orderId', asyncWrap(OrderController.deleteOrderById))
    router.get('/:orderId', asyncWrap(OrderController.getOrderInfoById))
    router.put('/:orderId', asyncWrap(OrderController.updateOrderInfoById))
    router.post(
      '/:orderId/checkout',
      asyncWrap(OrderController.checkoutOrderById)
    )
    router.get('/', asyncWrap(OrderController.getOrders))
  }
}
export default OrderRouter
