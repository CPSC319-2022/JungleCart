import express, { Request, Response } from 'express'
import { listBuyers, addBuyers } from '../controllers/buyer.controller'

export const buyerRouter = express.Router()

buyerRouter.route('/').get((req: Request, res: Response) => res.json('welcome'))

buyerRouter.route('/buyers').get(listBuyers)
buyerRouter.post('/buyers/post', addBuyers)
