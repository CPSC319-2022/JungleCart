import SQLManager from '../../core/SQLManager';

class AdminModel {
  public async getUsers() {
    const sql = `SELECT JSON_OBJECT(
      'admin', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'department', d.name,
        'email', u.email
        )) FROM dev.user u JOIN dev.department d ON d.id = u.department_id WHERE u.is_admin = 1),
        'user', (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'department', d.name,
            'email', u.email
            )) FROM dev.user u JOIN dev.department d ON d.id = u.department_id WHERE u.is_admin = 0)) as combined`;
    return await SQLManager.query(sql);
  }

  public async getAdminById(adminId) {
    const sql = `SELECT u.id, u.first_name, u.last_name, d.name, u.email FROM dev.user u JOIN dev.department d ON d.id = u.department_id WHERE u.id = ?`;
    return await SQLManager.query(sql, [adminId]);
  }

  public async addUser(user) {
    const sql = `INSERT INTO dev.user SET ?`;
    return await SQLManager.query(sql, [user]);
  }

  public async checkAdminAuth(aid) {
    const sql = `SELECT COUNT(*) FROM dev.user WHERE is_admin = 1 AND id = ?`;
    return await SQLManager.query(sql, [aid]);
  }

  public async isEmailExist(email) {
    const sql = `SELECT COUNT(*) FROM dev.user WHERE email = ?`;
    return await SQLManager.query(sql, [email]);
  }

  public async deleteUserById(uid) {
    const sql = `DELETE FROM dev.user WHERE id = ?`;
    return await SQLManager.query(sql, [uid]);
  }

  public async getAdminDashboard(id) {
    //
  }

  public async changeAdminsStatus(admin, action) {
    const sql = `UPDATE dev.user SET is_admin = ? WHERE id = ?`;
    return await SQLManager.query(sql, [action, admin]);
  }

  // public async findAllAdmins() {
  //   const sql = 'SELECT * FROM admin';
  //   const users = await query(sql);
  //   return users;
  // }
}

export default new AdminModel();
