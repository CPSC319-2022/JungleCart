import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'

class OrderController {
  constructor() {
    //
  }

  public async addOrder(req: Request, res: Response) {
    //
  }

  public async deleteOrderById(req: Request, res: Response) {
    //
  }

  public async getOrderInfoById(req: Request, res: Response) {
    //
  }

  public async updateOrderInfoById(req: Request, res: Response) {
    //
  }

  public async checkoutOrderById(req: Request, res: Response) {
    //
  }

  public async getOrders(req: Request, res: Response) {
    //
  }
}

export default new OrderController();