/* eslint-disable @typescript-eslint/no-var-requires */
const UserModel = require('./UserModel');

import dotenv from 'dotenv';

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
  private mockTest: boolean;
  private userModel: typeof UserModel;
  constructor() {
    this.mockTest = false;
    this.userModel = UserModel;
  }

  public async updateUserInfoById(id, info) {
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

  public async deleteAddressById(userId, addressId) {
    return await this.userModel.deleteAddressById(userId, addressId);
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
