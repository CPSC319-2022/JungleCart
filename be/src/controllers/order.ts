import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import dotenv from 'dotenv'
dotenv.config()
//import { OrderSevice } from '../services'
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
    //const userId = req.params.id;
    //const orders = await OrderService.getOrders(userId)
    //res.status(200).json({ orders })
  }
}

export default new OrderController()
