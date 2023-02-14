import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import * as mock from '../database/mock/data'

class MockUserModel {
  constructor() {
    //
  }

  public async getUserInfoById(id) {
    return mock.user.users[id - 1]
  }

  public async getBuyerInfo(id: number) {
    return mock.buyer[0]
  }

  public async getSellerInfo(id: number) {
    return mock.seller[0]
  }

  public async checkUserId(id: number) {
    return true
  }
}

export default new MockUserModel()
