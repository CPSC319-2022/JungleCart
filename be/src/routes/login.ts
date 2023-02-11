import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { LoginController } from '../controllers'
class LoginRouter extends PathRouter {
  constructor() {
    const path = ''
    const router = Router()
    super(path, router)
    router.post('/login', asyncWrap(LoginController.login))
    router.post('/logout', asyncWrap(LoginController.logout))
  }
}
export default LoginRouter
