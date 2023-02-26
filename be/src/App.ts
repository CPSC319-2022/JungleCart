import dotenv from 'dotenv';
import cors from 'cors';
import express, {Express, Request, Response} from 'express';
import {PathRouter} from './utils/routers';

dotenv.config()

const PORT = process.env.PORT || 10010

const allowedOrigins = [`http://localhost:${PORT}`]

const corsOption = {
  origin: '*',
}

export class ExpressApp {
  app: Express

  constructor(routers: PathRouter[]) {
    this.app = express()
    this.app.use(cors(corsOption))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.get('/ping', (req: Request, res: Response) => {
      res.json({ message: 'pong' })
    })
    routers.forEach((router) => {
      this.app.use('/v2' + router.path, router.router)
    })
  }

  listen(port: number) {
    this.app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`)
    })
  }
}
