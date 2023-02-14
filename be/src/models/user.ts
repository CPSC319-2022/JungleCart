import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import { connection, query } from '../utils/db'
import * as mock from '../database/mock/data'

class UserModel {
  constructor() {
    //
  }

  public async getUserInfoById(id) {
    return {}
  }

  public async getBuyerInfo(id) {
    return {}
  }

  public async getSellerInfo(id) {
    return {}
  }

  public async checkUserId(id: number) {
    return true
  }
}

export default new UserModel()
