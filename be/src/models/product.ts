import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import prisma from '../prisma'
import * as mock from '../database/mock/data'
class ProductModel {
  constructor() {
    //
  }

  public async getProductInfoById(id: number) {
    console.log('id = ', id)
    const product: Array<dto.Product> = await prisma.$queryRaw`
      SELECT * FROM product WHERE id=${id}
    `
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
