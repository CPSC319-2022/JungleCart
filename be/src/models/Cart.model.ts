import { connection, query } from '../utils/db'

export async function createCartItem(buyer_id, product_id, quantity) {
  const conn = await connection()
  const sql = `INSERT INTO 
    cart_item(buyer_id, product_id, quantity) 
    VALUES
    ('${buyer_id}','${product_id}','${quantity}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllCartItems() {
  const conn = await connection()
  const sql = 'SELECT * FROM cart_item'
  const users = await query(conn, sql)
  return users
}
