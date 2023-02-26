import {Router} from 'express';
import {PathRouter} from '../utils/routers';
import asyncWrap from '../async-wrap';
import {BuyerController} from '../controllers';

class BuyerRouter extends PathRouter {
  constructor() {
    const path = '/buyers'
    const router = Router()
    super(path, router)
    router.get('/', asyncWrap(BuyerController.listBuyers))
    router.post('/', asyncWrap(BuyerController.addBuyers))
    router.get('/:userId/buyer', asyncWrap(BuyerController.getBuyerInfo))
    router.post('/:userId/payments', asyncWrap(BuyerController.addPayment))
    router.delete(
      '/:userId/payments/:paymentId',
      asyncWrap(BuyerController.deletePaymentById)
    )
    router.put(
      '/:userId/payments/:paymentId',
      asyncWrap(BuyerController.updatePaymentById)
    )
    router.get(
      '/:userId/payments/:paymentId',
      asyncWrap(BuyerController.getPaymentInfoById)
    )
  
  }
}
export default BuyerRouter
