import express, { Request, Response } from 'express'
import { addSeller , listSellers } from '../controllers/seller.controller'

export const sellerRouter = express.Router()

sellerRouter
  .route('/')
  .get((req: Request, res: Response) => res.json('welcome'))

sellerRouter.route('/sellers').get(listSellers)
sellerRouter.post('/seller/post', addSeller)
