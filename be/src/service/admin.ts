import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import axios from 'axios'
import { AdminModel, MockAdminModel } from '../models'
import * as model from '../utils/types'
import * as dto from '../utils/types.dto'
import { TokenObj } from '../utils/token'
import errorGenerator from '../utils/errorGenerator'
import dotenv from 'dotenv'
dotenv.config()

class AdminService {
  private mockTest: boolean
  private adminModel: typeof AdminModel | typeof MockAdminModel

  constructor() {
    this.mockTest = true
    this.adminModel = this.mockTest ? MockAdminModel : AdminModel
  }

  public async getUsers(adminId) {
    await this.checkAdminAuth(adminId)
    return await this.adminModel.getUsers()
  }

  public async addUser(user: dto.User) {
    await this.checkInputValid(user)
    return await this.adminModel.addUser(user)
  }

  public async getAdminInfoById(adminId) {
    return await this.adminModel.getAdminInfoById(adminId)
    //
  }

  public async deleteUserById() {
    //
  }

  public async deleteUserByEmail() {
    //
  }

  private async checkAdminAuth(adminId) {
    // errorGenerator({message: 'NOT AUTHORIZED TO DELETE USER', statusCode: 401})
  }

  private async checkInputValid(user: dto.User) {
    if (user.email) {
      //await this.adminModel.isEmailExist(user.email)
    }
    return true
  }
}

export default new AdminService()
