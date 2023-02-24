import {Request, Response} from 'express';
import * as model from '../utils/types';
import {AdminService} from '../service';
import dotenv from 'dotenv';

dotenv.config()

class AdminController {
  constructor() {
    console.log('admin controller constructor')
  }

  public async getUsers(req: Request, res: Response) {
    const adminId = req.params.adminId
    const users = await AdminService.getUsers(adminId)
    res.status(200).json({ users })
  }

  public async deleteUserById(req: Request, res: Response) {
    //
    res.status(201).json({ message: 'user deleted' })
  }

  public async addUser(req: Request, res: Response) {
    const newUser = req.body
    const user = await AdminService.addUser(newUser)
    res.send(user)
  }

  public async getAdminInfoById(req: Request, res: Response) {
    const adminId = req.params.adminId
    const admin = await AdminService.getAdminInfoById(adminId)
    res.status(201).json({ admin })
  }

  public async addAdmins(req: Request, res: Response) {
    const info: model.Admin = req.body
    const user = await AdminService.addAdmins(info)
    res.send(user)
  }
}

export default new AdminController()
