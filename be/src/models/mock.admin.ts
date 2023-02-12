import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import prisma from '../prisma'
import * as mock from '../database/mock/data'

class MockAdminModel {
  constructor() {
    //
  }

  public async getAdminInfoById(adminId) {
    return mock.user.admin[0];
  }


  public async getUsers() {
    return mock.user;
  }

  public async addUser(user) {
    return {};
  }

  private async isEmailExist(email) {
    return true;
  }
}

export default new MockAdminModel();