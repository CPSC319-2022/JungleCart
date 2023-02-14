import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'
import { UserModel, MockUserModel } from '../models'
import * as model from '../utils/types'
import * as dto from '../utils/types.dto'
import { TokenObj } from '../utils/token'
import errorGenerator from '../utils/errorGenerator'
import dotenv from 'dotenv'
dotenv.config()

class UserService {
  private mockTest: boolean
  private userModel: typeof MockUserModel | typeof UserModel
  constructor() {
    this.mockTest = true;
    this.userModel = this.mockTest ? MockUserModel : UserModel
  }

  public async updateUserInfoById() {}

  public async getUserInfoById(id: number) {
    this.checkUserIdExist(id)
    return await this.userModel.getUserInfoById(id)
  }

  public async getAddresses() {}

  public async deleteAddressById() {}

  public async getBuyerInfo(id) {
    // this.checkUserIdExist(id);
    return await this.userModel.getBuyerInfo(id)
  }

  public async addPayment() {}

  public async deletePaymentById() {}

  public async updatePaymentById() {}

  public async getPaymentInfoById() {}

  public async getSellerInfo(id) {
    return await this.userModel.getSellerInfo(id)
  }

  private async checkUserIdExist(id: number) {
    const result = await this.userModel.checkUserId(id)
    if (!result) {
      errorGenerator({
        message: 'INVALID REQUEST: user id not exist',
        statusCode: 422,
      })
    }
  }
}

export default new UserService()
