import { SQLConnectionManager } from '/opt/sql-layer';

class AdminModel {
  public async getUsers() {
    const sql = `SELECT JSON_OBJECT(
      'admin', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'department', d.name,
        'email', u.email
        )) FROM sqlDB.user u JOIN sqlDB.department d ON d.id = u.id WHERE u.is_admin = 1),
        'user', (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'department', d.name,
            'email', u.email
            )) FROM sqlDB.user u JOIN sqlDB.department d ON d.id = u.id WHERE u.is_admin = 0)) as combined`;
    return await SQLConnectionManager.queryPool(sql);
  }

  public async getAdminById(adminId) {
    const sql = `SELECT u.id, u.first_name, u.last_name, d.name, u.email FROM sqlDB.user u JOIN sqlDB.department d ON d.id = u.id WHERE u.id = ?`;
    return await SQLConnectionManager.queryPool(sql, [adminId]);
  }

  public async addUser(user) {
    const sql = `INSERT INTO sqlDB.user SET ?`;
    return await SQLConnectionManager.queryPool(sql, [user]);
  }

  public async checkAdminAuth(aid) {
    const sql = `SELECT COUNT(*) FROM sqlDB.user WHERE is_admin = 1 AND id = ?`;
    return await SQLConnectionManager.queryPool(sql, [aid]);
  }

  public async isEmailExist(email) {
    const sql = `SELECT COUNT(*) FROM user WHERE email = ?`;
    return await SQLConnectionManager.queryPool(sql, [email]);
  }

  public async deleteUserById(uid) {
    const sql = `DELETE FROM sqlDB.user WHERE id = ?`;
    return await SQLConnectionManager.queryPool(sql, [uid]);
  }

  public async getAdminDashboard(id) {
    //
  }

  public async addAdmins(info) {
    return true;
  }

  // public async addAdmin(info) {
  //   const sql = 'INSERT INTO admin SET ?';
  //   const newUser = await queryPool(sql);
  //   return newUser;
  // }

  // public async findAllAdmins() {
  //   const sql = 'SELECT * FROM admin';
  //   const users = await queryPool(sql);
  //   return users;
  // }
}

export default new AdminModel();
