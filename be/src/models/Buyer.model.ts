import { connection, query } from '../utils/db'
import { Payment_method } from '../utils/types'

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

export async function findBuyerById(id) {
  const conn = await connection()
  const sql = `SELECT * FROM buyer WHERE id = '${id}'`
  const buyer = await query(conn, sql)
  return buyer
}

//We are not supporting multiple payment_methods yet
export async function findPaymentByBuyerId(buyer_id) {
  const conn = await connection()
  const sql = `SELECT * 
  FROM payment_method P
  INNER JOIN buyer B
  ON B.pref_pm_id= P.id
  WHERE B.id = '${buyer_id}'`
  const pm = await query(conn, sql)
  console.log('pm', pm)
  return pm
}

export async function createPayment(id, pmInfo: Payment_method) {
  const conn = await connection()
  const sql_1 = 'INSERT INTO payment_method SET ?'
  const sql_2 = 'UPDATE buyer SET pref_pm_id = ? WHERE id = ?'
  const pm = await query(conn, sql_1, [pmInfo])
  await query(conn, sql_2, [(pm as JSON)['insertId'], id])
  const buyer = await findPaymentByBuyerId(id)
  return buyer
}

export async function editPaymentById(id, info: Payment_method) {
  const conn = await connection()
  const sql =
    'UPDATE payment_method INNER JOIN buyer ON buyer.pref_pm_id = payment_method.id SET ? WHERE buyer.id = ?'
  await query(conn, sql, [info, id])
  const payment = await findPaymentByBuyerId(id)
  return payment
}

// ON DELETE CONSTRAINT
export async function deletePaymentByUId(id) {
  const conn = await connection()
  // const sql = 'DELETE FROM payment_method WHERE id = ?'
  const sql =
    'DELETE payment_method FROM payment_method INNER JOIN buyer ON buyer.pref_pm_id = payment_method.id WHERE buyer.id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

export async function deletePayment(id) {
  const conn = await connection()
  const sql = 'DELETE FROM payment_method WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}
