import { connection, query } from '../utils/db'
import { Payment_method } from '../utils/types'

class BuyerModel {
public async  addBuyers(info) {
  const conn = await connection()
  const sql = 'INSERT INTO buyer SET ?'
  const newUser = await query(conn, sql, [info])
  return newUser
}

public async  listBuyers() {
  const conn = await connection()
  const sql = 'SELECT * FROM buyer'
  const users = await query(conn, sql)
  return users
}

public async  getBuyerInfo(id) {
  const conn = await connection()
  const sql = 'SELECT * FROM buyer WHERE id = ?'
  const buyer = await query(conn, sql, [id])
  return buyer
}

public async  getPaymentInfoById(id) {
  const conn = await connection()
  const sql = 'SELECT * FROM payment_method WHERE id = ?'
  const buyer = await query(conn, sql, [id])
  return buyer
}

//We are not supporting multiple payment_methods yet
public async  getPaymentInfoByBuyerId(buyer_id) {
  const conn = await connection()
  const sql = 'SELECT * FROM payment_method P INNER JOIN buyer B ON B.pref_pm_id= P.id WHERE B.id = ?'
  const pm = await query(conn, sql, [buyer_id])
  return pm
}

public async  addPayment(id, pmInfo: Payment_method) {
  const conn = await connection()
  const sql_1 = 'INSERT INTO payment_method SET ?'
  const rst = await query(conn, sql_1, [pmInfo])
  return rst
}

public async  updatePaymentById(id, info: Payment_method) {
  const conn = await connection()
  const sql =
    'UPDATE payment_method INNER JOIN buyer ON buyer.pref_pm_id = payment_method.id SET ? WHERE buyer.id = ?'
  const rst = await query(conn, sql, [info, id])
  return rst
}

// ON DELETE CONSTRAINT
public async deletePaymentByBuyerId(id) {
  const conn = await connection()
  const sql =
    'DELETE payment_method FROM payment_method INNER JOIN buyer ON buyer.pref_pm_id = payment_method.id WHERE buyer.id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

public async deletePaymentById(id) {
  const conn = await connection()
  const sql = 'DELETE FROM payment_method WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}
}

export default new BuyerModel()