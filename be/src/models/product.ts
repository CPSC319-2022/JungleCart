import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import { connection, query } from '../utils/db'
import * as mock from '../database/mock/data'
class ProductModel {
  constructor() {
    //
  }

  public async getProductInfoById(id: number) {
    console.log('id = ', id)
    const query = `
    SELECT * FROM product WHERE id=${id}
  `
    const conn = await connection()
    const product = await conn.query(query)
    // const product: Array<dto.Product> = await prisma.$queryRaw`
    //   SELECT * FROM product WHERE id=${id}
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
