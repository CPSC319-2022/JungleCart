import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { UserController } from '../controllers'
class UserRouter extends PathRouter {
  constructor() {
    const path = '/users'
    const router = Router()
    super(path, router)
    router.put('/:userId', asyncWrap(UserController.updateUserInfoById))
    router.get('/:userId', asyncWrap(UserController.getUserInfoById))
    router.get('/:userId/addresses', asyncWrap(UserController.getAddresses))
    router.post('/:userId/addresses', asyncWrap(UserController.addAddress))
    router.delete(
      '/:userId/addresses/:addressId',
      asyncWrap(UserController.deleteAddressById)
    )
    router.put(
      '/:userId/addresses/:addressId',
      asyncWrap(UserController.updateAddressById)
    )
    router.get('/:userId/buyer', asyncWrap(UserController.getBuyerInfo))
    router.post('/:userId/payments', asyncWrap(UserController.addPayment))
    router.delete(
      '/:userId/payments/:paymentId',
      asyncWrap(UserController.deletePaymentById)
    )
    router.put(
      '/:userId/payments/:paymentId',
      asyncWrap(UserController.updatePaymentById)
    )
    router.get(
      '/:userId/payments/:paymentId',
      asyncWrap(UserController.getPaymentInfoById)
    )
    router.get('/:userId/seller', asyncWrap(UserController.getSellerInfo))
  }
}
export default UserRouter
