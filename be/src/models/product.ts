import { connection, query } from '../utils/db'
import { Product } from '../utils/types'
import * as dto from '../utils/types.dto'


class ProductModel {
  public async  addProduct(prod: dto.Product) {
    const conn = await connection()
    const sql = 'INSERT INTO product SET ?'
    const newUser = await query(conn, sql, [prod])
    return newUser
  }

    public async  findAllProducts() {
    const conn = await connection()
    const sql = 'SELECT * FROM product'
    const users = await query(conn, sql)
    return users
  }

    public async  getProductInfoById(id) {
    const conn = await connection()
    const sql = 'SELECT * FROM product WHERE id = ?'
    const prod = await query(conn, sql, [id])
    return prod
  }

    public async  deleteProductById(id) {
    const conn = await connection()
    const sql = 'DELETE FROM product WHERE id = ?'
    const rst = await query(conn, sql, [id])
    return rst
  }

    public async  updateProductInfoById(id, info: Product) {
    const conn = await connection()
    const sql = 'UPDATE product SET ? WHERE id = ?'
    const rst = await query(conn, sql, [info, id])
    return rst
  }

  public async getProductsInfo(searchOpt, order, pageOpt) {
    
  }
}

export default new ProductModel()