/* eslint-disable @typescript-eslint/no-var-requires */
//const UserModel = require('./UserModel');

interface CustomErrorSetup {
  statusCode: number;
  message: string;
}
interface CustomError extends Error {
  statusCode?: number | undefined;
  message: string;
}

class UserService {
  private mockTest: boolean;
  static userModel: typeof UserModel;
  constructor() {
    this.mockTest = false;
    UserService.userModel = UserModel;
  }

  static async updateUserInfoById(id, info) {
    return await this.userModel.updateUserInfoById(id, info);
  }

  static async getUserInfoById(id: number) {
    this.checkUserIdExist(id);
    return await this.userModel.getUserInfoById(id);
  }

  static async getBuyerInfo(id) {
    this.checkUserIdExist(id);
    return await this.userModel.getBuyerInfo(id);
  }

  static async getSellerInfo(id) {
    return await this.userModel.getSellerInfo(id);
  }

  static async listUsers() {
    return await this.userModel.listUsers();
  }

  static async addUser(info) {
    return await this.userModel.addUser(info);
  }

  static async getAddresses(id) {
    return await this.userModel.getAddresses(id);
  }

  static async getAddressesByUserId(id) {
    return await this.userModel.getAddressesByUserId(id);
  }

  static async deleteAddressById(userId, addressId) {
    return await this.userModel.deleteAddressById(userId, addressId);
  }

  static async updateAddressById(id, info) {
    return await this.userModel.updateAddressById(id, info);
  }
  static async addAddress(info) {
    return await this.userModel.addAddress(info);
  }

  static async checkUserIdExist(id: number) {
    const result = await this.userModel.checkUserIdExist(id);
    if (!result) {
      this.errorGenerator({
        message: 'INVALID REQUEST: user id not exist',
        statusCode: 422,
      });
    }
  }

  static isEmpty(obj: Record<string, unknown>) {
    return Object.keys(obj || {}).length === 0;
  }

  static errorGenerator(obj: CustomErrorSetup) {
    const error: CustomError = new Error(obj.message);
    error.statusCode = obj.statusCode;
    throw error;
  }
}

module.exports = new UserService();
