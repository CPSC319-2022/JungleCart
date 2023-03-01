/* eslint-disable @typescript-eslint/no-var-requires */
//const { UserModel } = require('/opt/nodejs/node_modules/user-layer');
//const UserModel = require('/opt/nodejs/node_modules/user-layer/model');
import dotenv from 'dotenv';
import UserModel from './model';
dotenv.config();
interface CustomErrorSetup {
  statusCode: number;
  message: string;
}
interface CustomError extends Error {
  statusCode?: number;
  message: string;
}

class UserService {
  constructor() {
    //
  }

  public async updateUserInfoById(id, info) {
    return await UserModel.updateUserInfoById(id, info);
  }

  public async getUserInfoById(id: number) {
    this.checkUserIdExist(id);
    return await UserModel.getUserInfoById(id);
  }

  public async getBuyerInfo(id) {
    this.checkUserIdExist(id);
    return await UserModel.getBuyerInfo(id);
  }

  public async getSellerInfo(id) {
    return await UserModel.getSellerInfo(id);
  }

  public async listUsers() {
    return await UserModel.listUsers();
  }

  public async addUser(info) {
    return await UserModel.addUser(info);
  }

  public async getAddresses(id) {
    return await UserModel.getAddresses(id);
  }

  public async getAddressesByUserId(id) {
    return await UserModel.getAddressesByUserId(id);
  }

  public async deleteAddressById(userId, addressId) {
    return await UserModel.deleteAddressById(userId, addressId);
  }

  public async updateAddressById(id, info) {
    return await UserModel.updateAddressById(id, info);
  }
  public async addAddress(info) {
    return await UserModel.addAddress(info);
  }

  private async checkUserIdExist(id: number) {
    const result = await UserModel.checkUserIdExist(id);
    if (!result) {
      this.errorGenerator({
        message: 'INVALID REQUEST: user id not exist',
        statusCode: 422,
      });
    }
  }

  private isEmpty(obj: Record<string, unknown>) {
    return Object.keys(obj || {}).length === 0;
  }

  private errorGenerator(obj: CustomErrorSetup) {
    const error: CustomError = new Error(obj.message);
    error.statusCode = obj.statusCode;
    throw error;
  }
}

export default new UserService();
//module.exports = UserService;
