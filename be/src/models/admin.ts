import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import prisma from '../prisma'
import * as mock from '../database/mock/data'

class AdminModel {
  constructor() {
    //
  }

  public async getUsers() {
    return {};
  }

  public async addUser(user: dto.User) {
    console.log(user);
    return {};
  }

  public async isEmailExist(email: string) {
    return true;
  }
}

export default new AdminModel();