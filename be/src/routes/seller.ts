import {Router} from 'express';
import {PathRouter} from '../utils/routers';
import asyncWrap from '../async-wrap';
import {SellerController} from '../controllers';

class SellerRouter extends PathRouter {
  constructor() {
    const path = '/sellers'
    const router = Router()
    super(path, router)

    router.get('/:id/seller', asyncWrap(SellerController.getSellerInfo))
    router.get('/', asyncWrap(SellerController.getAllSeller))
    router.post('/', asyncWrap(SellerController.addSeller))
    
  }
}
export default SellerRouter
