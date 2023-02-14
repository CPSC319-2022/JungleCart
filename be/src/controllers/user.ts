import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import { UserService } from './../services'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'

class UserController {
  constructor() {
    //
  }

  public async getUserInfoById(req: Request, res: Response) {
    const id = Number(req.params.id)
    const user: dto.User = await UserService.getUserInfoById(id)
    res.status(200).json({ user })
  }

  public async getBuyerInfo(req: Request, res: Response) {
    const id = Number(req.params.id)
    const buyer: dto.User = await UserService.getBuyerInfo(id)
    res.status(200).json({ buyer })
  }

  public async getSellerInfo(req: Request, res: Response) {
    const id = Number(req.params.id)
    const seller: dto.User = await UserService.getSellerInfo(id)
    res.status(200).json({ seller })
  }

  public async updateUserInfoById(req: Request, res: Response) {
    //
  }

  // Address
  public async getAddresses(req: Request, res: Response) {
    //
  }

  public async addAddress(req: Request, res: Response) {
    //
  }

  public async deleteAddressById(req: Request, res: Response) {
    //
  }

  public async updateAddressById(req: Request, res: Response) {
    //
  }

  // TODO:
  // Payment => extract class
  public async addPayment(req: Request, res: Response) {
    //
  }

  public async deletePaymentById(req: Request, res: Response) {
    //
  }

  public async updatePaymentById(req: Request, res: Response) {
    //
  }

  public async getPaymentInfoById(req: Request, res: Response) {
    //
  }
}

export default new UserController()