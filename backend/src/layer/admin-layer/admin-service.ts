/* eslint-disable @typescript-eslint/no-var-requires */
import AdminModel from './admin-model';
import { NotFoundError } from '/opt/sql-layer';
type UserInputValidation = {
  id?: number;
  email?: string;
};

class AdminService {
  public async getUsers() {
    const users = await AdminModel.getUsers();
    return JSON.parse((users as object)[0].combined);
  }

  public async addUser(email) {
    const rst = await AdminModel.addUser({ email: email });
    const user = JSON.parse(JSON.stringify(rst));
    return { id: user.insertId, email: email };
  }

  public async getAdminById(adminId) {
    const admin = await AdminModel.getAdminById(adminId);
    return JSON.parse(JSON.stringify(admin))[0];
  }

  public async addAdmins(info) {
    return await AdminModel.addAdmins(info);
  }

  public async deleteUserById(uid) {
    const userLog = await AdminModel.deleteUserById(uid);
    return JSON.parse(JSON.stringify(userLog));
  }

  public async getAdminDashboard(id) {
    return await AdminModel.getAdminDashboard(id);
  }

  public async checkAdminAuth(aid) {
    const rst = await AdminModel.checkAdminAuth(aid);
    return JSON.parse(JSON.stringify(rst))[0]['COUNT(*)'] !== 0;
  }

  public async isEmailExist(email) {
    const rst = await AdminModel.isEmailExist(email);
    return JSON.parse(JSON.stringify(rst))[0]['COUNT(*)'] === 0;
  }

  public async deleteUserByEmail() {
    //
  }
}

export default new AdminService();
