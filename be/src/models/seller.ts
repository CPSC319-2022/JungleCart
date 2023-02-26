import {connection, query} from '../utils/db';

class SellerModel {
  public async  addSeller(info) {
    const conn = await connection()
    const sql = 'INSERT INTO seller SET ?'
    const newUser = await query(conn, sql, [info])
    return newUser
  }

  public async  getAllSeller() {
    const conn = await connection()
    const sql = 'SELECT * FROM seller'
    const users = await query(conn, sql)
    return users
  }

  public async  getSellerInfo(id) {
    const conn = await connection()
    const sql = 'SELECT * FROM seller WHERE id = ?'
    const buyer = await query(conn, sql, [id])
    return buyer
  }
}

export default new SellerModel()
