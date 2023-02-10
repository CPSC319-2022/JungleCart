import express from 'express'
import type { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import * as UserService from '../service/User.service'
export const userRouter = express.Router()

//test api
userRouter.get('/', async (request: Request, response: Response) => {
  try {
    const user = await UserService.listUsers()
    return response.status(200).json(user)
  } catch (err: any) {
    return response.status(500).json(err.message)
  }
})
