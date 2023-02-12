import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import * as userService from './../services/user'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class UserController {
  constructor() {
    //
  }

  public async getUserInfoById(req: Request, res: Response) {
    const user: dto.User = (<any>req).user
    res.status(200).json({ user })
  }

  public async updateUserInfoById(req: Request, res: Response) {
    //
  }

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
  public async getBuyerInfo(req: Request, res: Response) {
    //
  }

  public async getSellerInfo(req: Request, res: Response) {
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
