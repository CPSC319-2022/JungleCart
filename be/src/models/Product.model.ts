import { connection, query } from '../utils/db'

export async function createProduct(
  seller_id,
  name,
  price,
  discount,
  description,
  address,
  status,
  shipping_method,
  updated_at,
  total_quantity,
  category_id
) {
  const conn = await connection()
  const sql = `INSERT INTO 
    product(seller_id, name, price, discount, description, address, status, shipping_method, updated_at, total_quantity, category_id) 
    VALUES
    ('${seller_id}','${name}','${price}','${discount}','${description}','${address}','${status}','${shipping_method}', '${updated_at}','${total_quantity}','${category_id}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllProducts() {
  const conn = await connection()
  const sql = 'SELECT * FROM product'
  const users = await query(conn, sql)
  return users
}
