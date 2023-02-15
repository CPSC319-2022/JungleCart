import { addAddress } from '../controllers/user.controller'
import { connection, query } from '../utils/db'
import { Address, User } from '../utils/types'

export async function createUser(userInfo: User) {
  const conn = await connection()
  const sql = 'INSERT INTO user SET ?'
  const nu = await query(conn, sql, [userInfo])
  const rst = await findUserById((nu as JSON)['insertId'])
  return rst
}

export async function findAllUsers() {
  const conn = await connection()
  const sql = 'SELECT * FROM user'
  const rst = await query(conn, sql)
  return rst
}

export async function findUserById(id) {
  const conn = await connection()
  const sql = 'SELECT * FROM user WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

export async function editUserInfo(id, info: User) {
  const conn = await connection()
  const sql = 'UPDATE user SET ? WHERE id = ?'
  await query(conn, sql, [info, id])
  const rst = await findUserById(id)
  return rst
}

// Address
export async function findAddressByUserId(user_id) {
  const conn = await connection()
  const sql = 'SELECT * FROM address WHERE user_id = ?'
  const rst = await query(conn, sql, [user_id])
  return rst
}

export async function findAddressById(id) {
  const conn = await connection()
  const sql = 'SELECT * FROM address WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}

export async function createAddress(addInfo: Address) {
  const conn = await connection()
  const sql = 'INSERT INTO address SET ?'
  const na = await query(conn, sql, [addInfo])
  const rst = await findAddressById((na as JSON)['insertId'])
  return rst
}

export async function editAddressById(id, info: Address) {
  const conn = await connection()
  const sql = 'UPDATE address SET ? WHERE id = ?'
  await query(conn, sql, [info, id])
  const rst = await findAddressById(id)
  return rst
}

export async function deleteAddress(id) {
  const conn = await connection()
  const sql = 'DELETE FROM address WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}
