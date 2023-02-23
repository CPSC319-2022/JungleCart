import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { UserController } from '../controllers'
class UserRouter extends PathRouter {
  constructor() {
    const path = '/users'
    const router = Router()
    super(path, router)

    router.get('/', asyncWrap(UserController.listUsers))
    router.put('/:userId', asyncWrap(UserController.updateUserInfoById))
    router.get('/:userId', asyncWrap(UserController.getUserInfoById))
    router.post('/', asyncWrap(UserController.addUser))

    router.get('/:userId/addresses', asyncWrap(UserController.getAddresses))
    router.get('/:userId/addresses/:addressId', asyncWrap(UserController.getAddressesByUserId))
    router.post('/:userId/addresses', asyncWrap(UserController.addAddress))
    router.delete('/:userId/addresses/:addressId', asyncWrap(UserController.deleteAddressById))
    router.put('/:userId/addresses/:addressId', asyncWrap(UserController.updateAddressById))


    router.get('/:userId/seller', asyncWrap(UserController.getSellerInfo))
    router.get('/:userId/buyer', asyncWrap(UserController.getBuyerInfo))
  }
}
export default UserRouter
