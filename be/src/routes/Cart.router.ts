import express, { Request, Response } from 'express'
import { listCarts, addCarts } from '../controllers/cart.controller'

export const cartRouter = express.Router()

cartRouter.route('/').get((req: Request, res: Response) => res.json('welcome'))

cartRouter.route('/carts').get(listCarts)
cartRouter.post('/carts/post', addCarts)
