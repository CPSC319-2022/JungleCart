import express, { Request, Response, Router } from 'express'
import {
  getProductsInfo,
  addProduct,
  getProductInfoById,
  deleteProductById,
  updateProductInfoById,
} from '../controllers/product.controller'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'

// class productRouter extends PathRouter {
// constructor() {
//   const path = '/products'
export const productRouter = Router()
// super(path, productRouter)
productRouter.get('/', asyncWrap(getProductsInfo))
productRouter.post('/', asyncWrap(addProduct))
productRouter.get('/:id', asyncWrap(getProductInfoById))
productRouter.delete('/:id', asyncWrap(deleteProductById))
productRouter.put('/:id', asyncWrap(updateProductInfoById))
// }
// }
// export default ProductRouter
