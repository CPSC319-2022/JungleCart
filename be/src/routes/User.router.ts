import { Express, Request, Response } from 'express'
import { listUsers } from '../controllers/user.controller'

//test api
export default function (app: Express) {
  app.get('/', (req: Request, res: Response) => res.json('Hello!'))
  app.get('/users', listUsers)
}
