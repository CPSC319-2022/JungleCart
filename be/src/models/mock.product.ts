import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import * as mock from '../database/mock/data'
class MockProductModel {
  constructor() {
    //
  }

  public async getProductInfoById(id: number) {
    return mock.product[id - 1]
  }

  public async getProductsInfo(searchOpt, order, page) {
    console.log('in getProducts Model')
    return mock.products
  }

  public async addProduct(produt: dto.Product) {
    return 9999
  }

  public async deleteProductById(productId: number) {
    return 9999
  }

  public async updateProductInfoById(id, info: dto.Product) {}
}

export default new MockProductModel()