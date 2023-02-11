import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { UserController } from '../controllers'
class UserRouter extends PathRouter {
  constructor() {
    const path = '/users'
    const router = Router()
    super(path, router)
    router.put('/:id', asyncWrap(UserController.updateUserInfoById))
    router.get('/:id', asyncWrap(UserController.getUserInfoById))
    router.get('/:id/addresses', asyncWrap(UserController.getAddresses))
    router.post('/:id/addresses', asyncWrap(UserController.addAddress))
    router.delete('/:id/addresses/:id', asyncWrap(UserController.deleteAddressById))
    router.put('/:id/addresses/:id', asyncWrap(UserController.updateAddressById))
    router.get('/:id/buyer', asyncWrap(UserController.getBuyerInfo))
    router.post('/:id/payments', asyncWrap(UserController.addPayment))
    router.delete('/:id/payments/:id', asyncWrap(UserController.deletePaymentById))
    router.put('/:id/payments/:id', asyncWrap(UserController.updatePaymentById))
    router.get('/:id/payments/:id', asyncWrap(UserController.getPaymentInfoById))
    router.get('/:id/seller', asyncWrap(UserController.getSellerInfo))
    }
}
export default UserRouter
