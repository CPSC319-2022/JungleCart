import { addAddress } from '../controllers/user.controller'
import { connection, query } from '../utils/db'
import { Address, User } from '../utils/types'

export async function createUser(userInfo: User) {
  const conn = await connection()
  const sql = 'INSERT INTO user SET ?'
  const nu = await query(conn, sql, [userInfo])
  const newUser = await findUserById((nu as JSON)['insertId'])
  return newUser
}

export async function findAllUsers() {
  const conn = await connection()
  const sql = 'SELECT * FROM user'
  const users = await query(conn, sql)
  return users
}

export async function findUserById(id) {
  const conn = await connection()
  const sql = `SELECT * FROM user WHERE id = '${id}'`
  const user = await query(conn, sql)
  return user
}

export async function editUserInfo(id, info: User) {
  const conn = await connection()
  const sql = 'UPDATE user SET ? WHERE id = ?'
  await query(conn, sql, [info, id])
  const newUser = await findUserById(id)
  return newUser
}

// Address
export async function findAddressByUserId(user_id) {
  const conn = await connection()
  const sql = `SELECT * FROM address WHERE user_id = '${user_id}'`
  const address = await query(conn, sql)
  return address
}

export async function findAddressById(id) {
  const conn = await connection()
  const sql = `SELECT * FROM address WHERE id = '${id}'`
  const address = await query(conn, sql)
  return address
}

export async function createAddress(addInfo: Address) {
  const conn = await connection()
  const sql = 'INSERT INTO address SET ?'
  const na = await query(conn, sql, [addInfo])
  const newAddress = await findAddressById((na as JSON)['insertId'])
  return newAddress
}

export async function editAddressById(id, info: Address) {
  const conn = await connection()
  const sql = 'UPDATE address SET ? WHERE id = ?'
  await query(conn, sql, [info, id])
  const newAdress = await findAddressById(id)
  return newAdress
}

export async function deleteAddress(id) {
  const conn = await connection()
  const sql = 'DELETE FROM address WHERE id = ?'
  const rst = await query(conn, sql, [id])
  return rst
}
