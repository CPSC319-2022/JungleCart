import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { AdminController } from '../controllers'
class AdminRouter extends PathRouter {
  constructor() {
    const path = '/admins/:adminId'
    const router = Router()
    super(path, router)
    router.get('/', asyncWrap(AdminController.getOrderInfoById))
    router.post('/users', asyncWrap(AdminController.addUser))
    router.get('/users', asyncWrap(AdminController.getUsers))
    router.delete('/users/:userId', asyncWrap(AdminController.deleteUserById))
  }
}
export default AdminRouter
