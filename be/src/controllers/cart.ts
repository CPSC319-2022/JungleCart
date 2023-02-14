import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'


class CartController {
  constructor() {
    //
  }

  public async getCartItems(req: Request, res: Response) {
    //
  }

  public async updateCartItems(req: Request, res: Response) {
    //
  }

  public async addCartItem(req: Request, res: Response) {
    //
  }

  public async deleteCartItemById(req: Request, res: Response) {
    //
  }
}

export default new CartController();