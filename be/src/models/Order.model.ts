import { connection, query } from '../utils/db'

export async function createOrder(buyer_id, status) {
  const conn = await connection()
  const sql = `INSERT INTO 
    orders(buyer_id, status) 
    VALUES
    ('${buyer_id}','${status}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllOrders() {
  const conn = await connection()
  const sql = 'SELECT * FROM orders'
  const users = await query(conn, sql)
  return users
}
export async function createOrderItem(
  order_id,
  product_id,
  shippings,
  quantity
) {
  const conn = await connection()
  const sql = `INSERT INTO 
    order_item(order_id, product_id, shippings, quantity) 
    VALUES
    ('${order_id}','${product_id}', '${shippings}', '${quantity}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllOrderItmes() {
  const conn = await connection()
  const sql = 'SELECT * FROM order_item'
  const users = await query(conn, sql)
  return users
}
