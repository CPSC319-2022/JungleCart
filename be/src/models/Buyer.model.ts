import { connection, query } from '../utils/db'

export async function createBuyer(id, pref_address_id, pref_pm_id) {
  const conn = await connection()
  const sql = `INSERT INTO 
    buyer(id, pref_address_id, pref_pm_id) 
    VALUES
    ('${id}','${pref_address_id}','${pref_pm_id}')`
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllBuyers() {
  const conn = await connection()
  const sql = 'SELECT * FROM buyer'
  const users = await query(conn, sql)
  return users
}
