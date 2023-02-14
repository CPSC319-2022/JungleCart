import express, { Request, Response } from 'express'
import {
  addSeller,
  listSellers,
  getSellerById,
} from '../controllers/seller.controller'
import asyncWrap from '../async-wrap'
export const sellerRouter = express.Router()

sellerRouter
  .route('/')
  .get((req: Request, res: Response) => res.json('welcome'))

sellerRouter.route('/sellers').get(listSellers)
sellerRouter.post('/seller/post', addSeller)

sellerRouter.get('/:id/seller', asyncWrap(getSellerById))
