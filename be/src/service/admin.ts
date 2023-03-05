import { AdminModel, MockAdminModel } from '../models';
import { User } from '../utils/types';
import dotenv from 'dotenv';

dotenv.config();
type UserInputValidation = {
  id?: number;
  email?: string;
};

class AdminService {
  // private mockTest: boolean;
  // private adminModel: typeof AdminModel | typeof MockAdminModel;
  private adminModel = AdminModel;

  constructor() {
    // this.mockTest = true;
    // this.adminModel = this.mockTest ? MockAdminModel : AdminModel;
  }

  public async getUsers() {
    const users = await this.adminModel.getUsers();
    return users;
  }

  public async addUser(email) {
    await this.isEmailExist(email);
    return await this.adminModel.addUser({ email: email });
  }

  public async getAdminInfoById(adminId) {
    return await this.adminModel.getAdminInfoById(adminId);
  }

  public async addAdmins(info) {
    return await this.adminModel.addAdmins(info);
  }

  public async deleteUserById(uid) {
    await this.isIdExist(uid);
    return await this.adminModel.deleteUserById(uid);
  }

  public async getAdminDashboard(id) {
    await this.isIdExist(id);
    return await this.adminModel.getAdminDashboard(id);
  }

  public async deleteUserByEmail() {
    //
  }

  private async isIdExist(id) {
    const count = await this.adminModel.isIdExist(id);
    const validation = JSON.parse(JSON.stringify(count))[0]['COUNT(*)'] === 0;
    if (validation) {
      throw new Error('no such id');
    }
  }

  private async isEmailExist(email) {
    const count = await this.adminModel.isEmailExist(email);
    const validation = JSON.parse(JSON.stringify(count))[0]['COUNT(*)'] !== 0;
    if (validation) {
      throw new Error('email already exist');
    }
  }
}

export default new AdminService();
