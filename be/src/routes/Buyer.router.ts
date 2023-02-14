import express, { Request, Response } from 'express'
import {
  listBuyers,
  addBuyers,
  getBuyerById,
  getPaymentByBuyerId,
  addPayment,
  deletePaymentByUserId,
  updatePaymentByUserId,
  deletePaymentById,
} from '../controllers/buyer.controller'
import asyncWrap from '../async-wrap'

export const buyerRouter = express.Router()

buyerRouter.route('/').get((req: Request, res: Response) => res.json('welcome'))

buyerRouter.route('/buyers').get(listBuyers)
buyerRouter.post('/buyers/post', addBuyers)

//buyer : from userRouter
buyerRouter.get('/:id/buyer', asyncWrap(getBuyerById))

//payment from userRouter
buyerRouter.get('/:user_id/payments/:id', asyncWrap(getPaymentByBuyerId))
buyerRouter.post('/:id/payments', asyncWrap(addPayment))
buyerRouter.put('/:id/payments', asyncWrap(updatePaymentByUserId))
buyerRouter.delete('/:id/payments', asyncWrap(deletePaymentByUserId))
buyerRouter.delete('/payments/:id', asyncWrap(deletePaymentById))
