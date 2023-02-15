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
    return (await this.sendQuery(query))[0]
  }

  public async getProductsInfo() {
    //
  }

  public async addProduct(productDTO: dto.Product) {
    const data = { ...productDTO }
    // const query = insertBuilder(data, 'product')
  }

  public async deleteProductById(productId: number) {
    const query = ``
    return await this.sendQuery(query)
  }

  private async sendQuery(query) {
    const conn = await connection()
    return await query(conn, query)
  }
}

export default new ProductModel()
