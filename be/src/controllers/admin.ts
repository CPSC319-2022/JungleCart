import { Request, Response } from 'express';
import * as model from '../utils/types';
import { AdminService } from '../service';
import dotenv from 'dotenv';

dotenv.config();

class AdminController {
  constructor() {
    console.log('admin controller constructor');
  }

  public async getUsers(req: Request, res: Response) {
    // const adminId = req.params.adminId;
    // await this.checkAdminAuth(adminId);
    const users = await AdminService.getUsers();
    res.status(200).json(users);
  }

  public async deleteUserById(req: Request, res: Response) {
    // const adminId = req.params.adminId;
    // await this.checkAdminAuth(adminId);
    const uid = req.params.userId.slice(1);
    try {
      const rst = await AdminService.deleteUserById(Number(uid));
      res.status(201).json({ message: 'user deleted' });
    } catch {
      res.status(404).json({ message: 'User of specified id does not exist' });
    }
  }

  public async addUser(req: Request, res: Response) {
    const adminId = req.params.adminId;
    await this.checkAdminAuth(adminId);
    const email = req.params.email;
    try {
      const user = await AdminService.addUser(email);
      res.send(user);
    } catch {
      // res.status(400);
    }
  }

  public async getAdminInfoById(req: Request, res: Response) {
    const adminId = req.params.adminId;
    // await this.checkAdminAuth(adminId);
    const admin = await AdminService.getAdminInfoById(adminId);
    res.status(200).json(admin);
  }

  public async addAdmins(req: Request, res: Response) {
    const adminId = req.params.adminId;
    await this.checkAdminAuth(adminId);
    const info: model.Admin = req.body;
    const user = await AdminService.addAdmins(info);
    res.send(user);
  }

  public async getAdminDashboard(req: Request, res: Response) {
    const adminId = req.params.adminId;
    // await this.checkAdminAuth(adminId);
    const user = await AdminService.getAdminDashboard(adminId);
    res.send(user);
  }

  private async checkAdminAuth(adminId) {
    // errorGenerator({message: 'NOT AUTHORIZED TO DELETE USER', statusCode: 401})
  }
}

export default new AdminController();
