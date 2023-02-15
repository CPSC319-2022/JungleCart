import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import { BuyerService } from './../service'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'
import { Buyer, Payment_method } from '../utils/types'

class BuyerController {
  public async listBuyers(req: Request, res: Response) {
    const rst = await BuyerService.listBuyers()
    return res.json(rst)
  }
  public async addBuyers(req: Request, res: Response) {
  const info = req.body
  const user = await BuyerService.addBuyers(info)
  res.send(user)
  }
  
  public async getBuyerInfo(req: Request, res: Response) {
    const buyer = await BuyerService.getBuyerInfo(Number(req.params.id))
    res.status(200).json({ buyer })
  }

  
  public async addPayment(req: Request, res: Response) {
    const newPayment: Payment_method = req.body
  const payment = await BuyerService.addPayment(Number(req.params.id), newPayment)
  res.send(payment)
  }

  public async deletePaymentById(req: Request, res: Response) {
    const rst = await BuyerService.deletePaymentById(req.params['user_id'].slice(1))
  return res.json(rst)
  }
  public async deletePaymentByBuyerId(req: Request, res: Response) {
    const rst = await BuyerService.deletePaymentByBuyerId(req.params['user_id'].slice(1))
  return res.json(rst)
  }

  public async updatePaymentById(req: Request, res: Response) {
    const addInfo: Payment_method = req.body
  const rst = await BuyerService.updatePaymentById(req.params['id'].slice(1), addInfo)
  return res.json(rst)
  }

  public async getPaymentInfoById(req: Request, res: Response) {
    const rst = await BuyerService.getPaymentInfoById(req.params['user_id'].slice(1))
  return res.json(rst)
  }

  public async getPaymentInfoByBuyerId(req: Request, res: Response) {
    const rst = await BuyerService.getPaymentInfoByBuyerId(req.params['user_id'].slice(1))
  return res.json(rst)
  }
}

export default new BuyerController()