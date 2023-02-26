import { connection, query } from '../utils/db';
import { User } from '../utils/types';

export async function addAdmin(info) {
  const conn = await connection();
  const sql = 'INSERT INTO admin SET ?';
  const newUser = await query(conn, sql);
  return newUser;
}

export async function findAllAdmins() {
  const conn = await connection();
  const sql = 'SELECT * FROM admin';
  const users = await query(conn, sql);
  return users;
}

class AdminModel {
  constructor() {
    //
  }

  public async getAdminInfoById(adminId) {
    const conn = await connection();
    const sql = 'SELECT * FROM admin WHERE id = ?';
    const ci = await query(conn, sql, [adminId]);
    return ci;
  }

  public async getUsers() {
    const conn = await connection();
    const sql = `SELECT JSON_OBJECT(
    'admin', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', a.id,
                'first_name', a.first_name,
                'last_name', a.last_name,
                'department', a.department,
                'email', a.email
            )) FROM admin a),
    'user', (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', u.id,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'department', u.department,
                'email', u.email
                )) FROM user u)) as combined`;
    const users = await query(conn, sql);
    return JSON.parse((users as object)[0].combined);
  }

  public async addUser(user: User) {
    const conn = await connection();
    const sql = 'INSERT INTO user SET ?';
    const nu = await query(conn, sql, [user]);
    return nu;
  }

  public async getAdminDashboard(id) {
    const conn = await connection();
    //
  }

  public async addAdmins(info) {
    return true;
  }

  public async isEmailExist(email) {
    const conn = await connection();
    const sql = 'SELECT COUNT(*) FROM user WHERE email = ?';
    const rst = await query(conn, sql, [email]);
    return rst;
  }

  public async isIdExist(uid) {
    const conn = await connection();
    const sql = 'SELECT COUNT(*) FROM user WHERE id = ?';
    const rst = await query(conn, sql, [uid]);
    return rst;
  }

  public async deleteUserById(uid) {
    const conn = await connection();
    const sql = 'DELETE FROM user WHERE id = ?';
    const nu = await query(conn, sql, [uid, uid]);
    console.log(nu);
    return nu;
  }
}

export default new AdminModel();
