import express, { Request, Response } from 'express'
import { listProducts, addProduct } from '../controllers/product.controller'

export const productRouter = express.Router()

productRouter
  .route('/')
  .get((req: Request, res: Response) => res.json('welcome'))

productRouter.route('/products').get(listProducts)
productRouter.post('/products/post', addProduct)
