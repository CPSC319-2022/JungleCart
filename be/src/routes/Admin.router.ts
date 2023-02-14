import express, { Request, Response } from 'express'
import { listAdmins, addAdmins } from '../controllers/admin.controller'

export const adminRouter = express.Router()

adminRouter.route('/').get((req: Request, res: Response) => res.json('welcome'))

adminRouter.route('/admins').get(listAdmins)
adminRouter.post('/admins/post', addAdmins)
