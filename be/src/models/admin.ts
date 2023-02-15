import { connection, query } from '../utils/db'
import * as dto from '../utils/types.dto'

export async function addAdmin(info) {
  const conn = await connection()
  const sql = 'INSERT INTO admin SET ?'
  const newUser = await query(conn, sql)
  return newUser
}

export async function findAllAdmins() {
  const conn = await connection()
  const sql = 'SELECT * FROM admin'
  const users = await query(conn, sql)
  return users
}

class AdminModel {
  constructor() {
    //
  }

  public async getAdminInfoById(adminId) {
    return {}
  }

  public async getUsers() {
    return {}
  }

  public async addUser(user: dto.User) {
    console.log(user)
    return {}
  }

  public async isEmailExist(email: string) {
    return true
  }

  public async addAdmins(info) {
    return true
  }
}

export default new AdminModel()
