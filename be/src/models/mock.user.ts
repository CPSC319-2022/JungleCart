import * as dto from '../utils/types.dto'
import { deleteBuilder, insertBuilder, updateBuilder } from './queryBuilder'
import * as mock from '../database/mock/data'
import { Address, User } from '../utils/types'

class MockUserModel {
  constructor() {
    //
  }

  public async getUserInfoById(id) {
    return mock.user.users[id - 1]
  }

  public async getBuyerInfo(id: number) {
    return mock.buyer[0]
  }

  public async getSellerInfo(id: number) {
    return mock.seller[0]
  }

  public async  addUser(userInfo: User) {
    // const conn = await connection()
    // const sql = 'INSERT INTO user SET ?'
    // const nu = await query(conn, sql, [userInfo])
    // const rst = await getUserInfoById((nu as JSON)['insertId'])
    // return nu
  }

  public async  listUsers() {
    // const conn = await connection()
    // const sql = 'SELECT * FROM user'
    // const rst = await query(conn, sql)
    // return rst
  }

  public async  updateUserInfoById(id, info: User) {
    // const conn = await connection()
    // const sql = 'UPDATE user SET ? WHERE id = ?'
    // const rst = await query(conn, sql, [info, id])
    // const rst = await getUserInfoById(id)
    // return rst
  }

  // Address
  public async  getAddressesByUserId(user_id) {
    // const conn = await connection()
    // const sql = 'SELECT * FROM address WHERE user_id = ?'
    // const rst = await query(conn, sql, [user_id])
    // return rst
  }

  public async  getAddresses(id) {
    // const conn = await connection()
    // const sql = 'SELECT * FROM address WHERE id = ?'
    // const rst = await query(conn, sql, [id])
    // return rst
  }

  public async  addAddress(addInfo: Address) {
    // const conn = await connection()
    // const sql = 'INSERT INTO address SET ?'
    // const na = await query(conn, sql, [addInfo])
    // const rst = await findAddressById((na as JSON)['insertId'])
    // return na
  }

  public async  updateAddressById(id, info: Address) {
    // const conn = await connection()
    // const sql = 'UPDATE address SET ? WHERE id = ?'
    // const rst = await query(conn, sql, [info, id])
    // const rst = await findAddressById(id)
    // return rst
  }

  public async  deleteAddressById(id) {
    // const conn = await connection()
    // const sql = 'DELETE FROM address WHERE id = ?'
    // const rst = await query(conn, sql, [id])
    // return rst
  }

  public async checkUserId(id: number) {
    return true
  }
}

export default new MockUserModel()
