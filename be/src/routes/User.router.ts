import express, { Request, Response } from 'express'
import { listUsers, addUsers } from '../controllers/user.controller'

export const userRouter = express.Router()

userRouter.route('/').get((req: Request, res: Response) => res.json('welcome'))

userRouter.route('/users').get(listUsers)
userRouter.post('/users/post', addUsers)
