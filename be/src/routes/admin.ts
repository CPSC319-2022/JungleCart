import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { AdminController } from '../controllers'
class AdminRouter extends PathRouter {
  constructor() {
    const path = '/admins'
    const router = Router()
    super(path, router)
    router.get('/:adminId', asyncWrap(AdminController.getAdminInfoById))
    router.post('/:adminId/users', asyncWrap(AdminController.addUser))
    router.get('/:adminId/users', asyncWrap(AdminController.getUsers))
    router.delete('/:adminId/users/:userId', asyncWrap(AdminController.deleteUserById))
  }
}
export default AdminRouter
