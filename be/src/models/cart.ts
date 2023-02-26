import {connection, query} from '../utils/db';

class CartModel {
  public async addCartItem(info) {
    const conn = await connection()
    const sql = 'INSERT INTO cart_item SET ?'
    const newUser = await query(conn, sql, [info])
    return newUser
  }

  public async findAllCartItems() {
    const conn = await connection()
    const sql = 'SELECT * FROM cart_item'
    const users = await query(conn, sql)
    return users
  }

  public async deleteCartItemById(id) {}

  public async getCartItems(id) {}

  public async updateCartItems(id, info) {}
}

export default new CartModel()
