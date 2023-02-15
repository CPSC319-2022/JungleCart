import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'

class LoginController {
  constructor() {
    //
  }

  public async googleLogin(req: Request, res: Response) {
    //
  }

  public async logout(req: Request, res: Response) {
    //
  }
}

export default new LoginController();
