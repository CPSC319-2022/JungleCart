import { connection, query } from '../utils/db'

export async function createSeller(id, banking_name, account_num) {
  const conn = await connection()
  const sql = `INSERT INTO 
    seller(id, banking_name, account_num) 
    VALUES
    ('${id}', '${banking_name}','${account_num}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllSellers() {
  const conn = await connection()
  const sql = 'SELECT * FROM seller'
  const users = await query(conn, sql)
  return users
}

export async function findSellerById(id) {
  const conn = await connection()
  const sql = `SELECT * FROM seller WHERE id = '${id}'`
  const buyer = await query(conn, sql)
  return buyer
}
