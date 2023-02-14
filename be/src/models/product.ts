import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import { connection, query } from '../utils/db'
import * as mock from '../database/mock/data'
class ProductModel {
  constructor() {
    //
  }

  public async getProductInfoById(id: number) {
    const query = `
    SELECT * FROM product WHERE id=${id}
  `
    const conn = await connection()
    const product = await conn.query(query)
    return product[0]
  }

  public async getProductsInfo() {
    //
  }

  public async addProduct(productDTO: dto.Product) {
    const data = { ...productDTO }
    // const query = insertBuilder(data, 'product')
  }
}

export default new ProductModel()
