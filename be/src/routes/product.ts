import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { ProductController } from '../controllers'
class ProductRouter extends PathRouter {
  constructor() {
    const path = '/products'
    const router = Router()
    super(path, router)
    router.post('/', asyncWrap(ProductController.addProduct))
    router.delete('/:id', asyncWrap(ProductController.deleteProductById))
    router.get('/:id', asyncWrap(ProductController.getProductInfoById))
    router.put('/:id', asyncWrap(ProductController.updateProductInfoById))
    router.get('/', asyncWrap(ProductController.getProductsInfo))
  }
}
export default ProductRouter
