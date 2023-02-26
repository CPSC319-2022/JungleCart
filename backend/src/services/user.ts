import { MockUserModel, UserModel } from '../models';
import * as model from '../utils/types.entity';
import * as dto from '../dto/user';
import errorGenerator from '../utils/errorGenerator';
import dotenv from 'dotenv';
import { IUserModel } from 'src/models/Iuser';

dotenv.config();

class UserService {
  private mockTest: boolean;
  private userModel: IUserModel;
  constructor() {
    this.mockTest = false;
    this.userModel = this.mockTest ? MockUserModel : UserModel;
  }

  public async updateUserInfoById(id, info: model.User) {
    return await this.userModel.updateUserInfoById(id, info);
  }

  public async getUserInfoById(id: number) {
    this.checkUserIdExist(id);
    return await this.userModel.getUserInfoById(id);
  }

  public async getBuyerInfo(id) {
    this.checkUserIdExist(id);
    return await this.userModel.getBuyerInfo(id);
  }

  public async getSellerInfo(id) {
    return await this.userModel.getSellerInfo(id);
  }

  public async listUsers() {
    return await this.userModel.listUsers();
  }

  public async addUser(info) {
    return await this.userModel.addUser(info);
  }

  public async getAddresses(id) {
    return await this.userModel.getAddresses(id);
  }

  public async getAddressesByUserId(id) {
    return await this.userModel.getAddressesByUserId(id);
  }

  public async deleteAddressById(id) {
    return await this.userModel.deleteAddressById(id);
  }

  public async updateAddressById(id, info) {
    return await this.userModel.updateAddressById(id, info);
  }
  public async addAddress(info) {
    return await this.userModel.addAddress(info);
  }

  private async checkUserIdExist(id: number) {
    const result = await this.userModel.checkUserIdExist(id);
    if (!result) {
      errorGenerator({
        message: 'INVALID REQUEST: user id not exist',
        statusCode: 422,
      });
    }
  }

  private isEmpty(obj: Record<string, any>) {
    return Object.keys(obj || {}).length === 0;
  }
}

export default new UserService();
