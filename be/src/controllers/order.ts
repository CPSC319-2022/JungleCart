import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import {OrderService} from '../service'
import dotenv from 'dotenv'
dotenv.config()
//import { OrderSevice } from '../services'
import errorGenerator from '../utils/errorGenerator'

class OrderController {
  constructor() {
    //
  }

  public async addOrder(req: Request, res: Response) {
    //console.log(req)
  // const order: Order = req.body
  // const user = createOrder(order)
  // res.send(user)
  }

  public async deleteOrderById(req: Request, res: Response) {
    const rst = await OrderService.deleteOrderById(req.params['id'].slice(1))
  return res.json(rst)
  }

  public async getOrderInfoById(req: Request, res: Response) {
    const rst = await OrderService.getOrderInfoById(req.params['id'].slice(1))
  return res.json(rst)
  }

  public async getOrderInfoByBuyerId(req: Request, res: Response) {
    const rst = await OrderService.getOrderInfoByBuyerId(req.params['id'].slice(1))
  return res.json(rst)
  }

  public async listAllOrderItems(req: Request, res: Response) {
    const rst = await OrderService.listAllOrderItems()
  return res.json(rst)
  }

  public async listOrderItmesByOrderId(req: Request, res: Response) {
    const rst = await OrderService.listOrderItmesByOrderId(req.params['id'].slice(1))
  return res.json(rst)
  }

  public async updateOrderInfoById(req: Request, res: Response) {
    //
  }

  public async checkoutOrderById(req: Request, res: Response) {
    //
  }

  public async getOrders(req: Request, res: Response) {
    const rst = await OrderService.getOrders()
  return res.json(rst)
  }
}

export default new OrderController()
