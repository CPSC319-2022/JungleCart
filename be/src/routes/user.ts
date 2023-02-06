import { Router } from 'express';
import { PathRouter } from '../utils/routers';
import asyncWrap from '../async-wrap';
import { userController } from '../controller';
class UserRouter extends PathRouter {
  constructor() {
    const path = '/user';
    const router = Router();
    super(path, router);
    router.post('/signup', asyncWrap(userController.signup));
    router.post('/login', asyncWrap(userController.login));
  }
}
export default UserRouter;
