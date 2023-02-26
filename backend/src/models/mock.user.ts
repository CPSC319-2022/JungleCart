import * as mock from '../database/mock/data';
import { Address, User } from '../utils/types.entity';
import { IUserModel } from './Iuser';

class MockUserModel implements IUserModel {
  constructor() {
    //
  }

  public async getUserInfoById(id) {
    return mock.user.users[id - 1];
  }

  public async getBuyerInfo(id: number) {
    return mock.buyer[0];
  }

  public async getSellerInfo(id: number) {
    return mock.seller[0];
  }

  public async addUser(userInfo: User) {
    return 1;
  }

  public async listUsers() {
    return {};
  }

  public async updateUserInfoById(id, info: User) {
    return 1;
  }

  // Address
  public async getAddressesByUserId(userId) {
    return {};
  }

  public async getAddresses(id) {
    return {};
  }

  public async addAddress(addInfo: Address) {
    return 1;
  }

  public async updateAddressById(id, info: Address) {
    return 1;
  }

  public async deleteAddressById(id) {
    return true;
  }

  public async checkUserIdExist(id: number) {
    return true;
  }
}

export default new MockUserModel();
