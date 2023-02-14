import express, { Request, Response } from 'express'
import {
  listUsers,
  addUser,
  getUserById,
  getAddressesByUserId,
  addAddress,
  updateUser,
  updateAddressById,
  deleteAddressById,
} from '../controllers/user.controller'
import asyncWrap from '../async-wrap'

export const userRouter = express.Router()

userRouter.route('/').get((req: Request, res: Response) => res.json('welcome'))

userRouter.get('/users', asyncWrap(listUsers))
userRouter.post('/users', asyncWrap(addUser))
userRouter.get('/user/:id', asyncWrap(getUserById))
userRouter.put('/user/:id', asyncWrap(updateUser))

userRouter.get('/:id/addresses', asyncWrap(getAddressesByUserId))
userRouter.post('/:id/addresses', asyncWrap(addAddress))
userRouter.put('/addresses/:id', asyncWrap(updateAddressById))
userRouter.delete('/addresses/:id', asyncWrap(deleteAddressById))

//buyer -> buyer module
// router.get('/:id/buyer', asyncWrap(UserController.getBuyerInfo))

//seller -> seller module
// userRouter.get('/:id/seller', asyncWrap(getSellerInfo))

// payment -> buyer module
// userRouter.get('/:id/payments/:id', asyncWrap(getPaymentByBuyerId))
// userRouter.post('/:id/payments', asyncWrap(UserController.addPayment))
// userRouter.delete(
// '/:id/payments/:id',
// asyncWrap(UserController.deletePaymentById)
// )
// userRouter.put('/:id/payments/:id', asyncWrap(UserController.updatePaymentById))
