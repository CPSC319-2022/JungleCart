import { connection, query } from '../utils/db'
import { Product } from '../utils/types'

export async function createProduct(prod: Product) {
  const conn = await connection()
  const sql = 'INSERT INTO product SET ?'
  const newUser = await query(conn, sql, [prod])
  return newUser
}

export async function findAllProducts() {
  const conn = await connection()
  const sql = 'SELECT * FROM product'
  const users = await query(conn, sql)
  return users
}

export async function findProductById(id) {
  const conn = await connection()
  const sql = 'SELECT * FROM product WHERE id = ?'
  const prod = await query(conn, sql, [id])
  return prod
}

export async function deleteProduct(id) {
  const conn = await connection()
  const sql = 'DELETE FROM product WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

export async function editProductById(id, info: Product) {
  const conn = await connection()
  const sql = 'UPDATE product SET ? WHERE id = ?'
  await query(conn, sql, [info, id])
  const rst = await findProductById(id)
  return rst
}
