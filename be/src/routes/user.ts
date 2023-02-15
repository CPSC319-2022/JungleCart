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
    router.put('/:id', asyncWrap(UserController.updateUserInfoById))
    router.get('/:id', asyncWrap(UserController.getUserInfoById))
    router.post('/', asyncWrap(UserController.addUser))

    router.get('/:id/addresses', asyncWrap(UserController.getAddresses))
    router.get('/addresses/:id', asyncWrap(UserController.getAddressesByUserId))
    router.post('/:id/addresses', asyncWrap(UserController.addAddress))
    router.delete('/:id/addresses/:id', asyncWrap(UserController.deleteAddressById))
    router.put('/:id/addresses/:id', asyncWrap(UserController.updateAddressById))
  }
}
export default UserRouter
