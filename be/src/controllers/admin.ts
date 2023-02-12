import express from 'express'
import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import { AdminService } from '../services'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'

class AdminController {
  constructor() {
    console.log('admin controller constrouctor')
  }

  public async getUsers(req: Request, res: Response) {
    const adminId = req.params.adminId
    const users = await AdminService.getUsers(adminId)
    res.status(200).json({ users })
  }

  public async deleteUserById(req: Request, res: Response) {
    //
    res.status(201).json({ message: 'content deleted' });
  }

  public async addUser(req: Request, res: Response) {
    //
    const id = 9999;
    res.status(201).json({id: id});

  }

  public async getOrderInfoById(req: Request, res: Response) {
    //
    res.status(201).json({ message: 'content deleted' });
  }
}

export default new AdminController()
