import * as mock from '../database/mock/data';

class MockAdminModel {
  constructor() {
    //
  }

  public async getAdminInfoById(adminId) {
    return mock.user.admin[0]
  }

  public async getUsers() {
    return mock.user
  }

  public async addUser(user) {
    return {}
  }

  private async isEmailExist(email) {
    return true
  }

  public async addAdmins(info) {
    return true
  }
}

export default new MockAdminModel()
