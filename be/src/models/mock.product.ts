import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import * as mock from '../database/mock/data'
class MockProductModel {
  private mockTest: boolean
  constructor() {
    this.mockTest = true
  }

  public async getProductInfoById(id: number) {
    return mock.product[id - 1]
  }

  public async getProductsInfo(searchOpt, order, page) {
    console.log('in getProducts Model')
    return mock.products
  }

  public async addProduct(produtDTO: dto.Product) {
    return 9999;
  }
}

export default new MockProductModel()
