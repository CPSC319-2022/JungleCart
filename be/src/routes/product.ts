import {Router} from 'express';
import {PathRouter} from '../utils/routers';
import asyncWrap from '../async-wrap';
import {ProductController} from '../controllers';

class ProductRouter extends PathRouter {
  constructor() {
    const path = '/products'
    const router = Router()
    super(path, router)
    router.post('/', asyncWrap(ProductController.addProduct))
    router.delete('/:productId', asyncWrap(ProductController.deleteProductById))
    router.get('/:productId', asyncWrap(ProductController.getProductInfoById))
    router.put('/:productId', asyncWrap(ProductController.updateProductInfoById))
    router.get('/', asyncWrap(ProductController.getProductsInfo))
  }
}
export default ProductRouter
