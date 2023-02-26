// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('/opt/nodejs/node_modules/sql-layer');
import { IUserModel } from './Iuser';
import { sendQuery } from 'src/utils/db';
import {
  deleteBuilder,
  insertBuilder,
  selectBuilder,
  updateBuilder,
} from './queryBuilder';

class UserModel implements IUserModel {
  public async addUser(userInfo) {
    const sql = insertBuilder(userInfo, 'user');
    return await sendQuery(sql);
  }

  public async listUsers() {
    const sql = selectBuilder(['all'], 'user');
    return await sendQuery(sql);
  }

  public async getUserInfoById(id) {
    const sql = selectBuilder(['all'], 'user', { id: `${id}` });
    return await sendQuery(sql, [id]);
  }

  public async updateUserInfoById(id, userInfo) {
    const sql = updateBuilder(id, userInfo, 'user');
    return await sendQuery(sql);
  }

  // Address
  public async getAddressesByUserId(user_id) {
    const sql = selectBuilder(['all'], 'address', { user_id: `${user_id}` });
    return await sendQuery(sql);
  }

  public async getAddresses(id) {
    const sql = selectBuilder(['all'], 'address', { id: `${id}` });
    return await sendQuery(sql);
  }

  public async addAddress(addInfo) {
    const sql = insertBuilder(addInfo, 'address');
    return await sendQuery(sql);
  }

  public async updateAddressById(id, info) {
    const sql = updateBuilder(id, info, 'address');
    return await sendQuery(sql);
  }

  public async deleteAddressById(id) {
    const sql = deleteBuilder({ id: `${id}` }, 'address');
    return await sendQuery(sql);
  }

  public async getBuyerInfo(id) {
    return {};
  }

  public async getSellerInfo(id) {
    return {};
  }

  public async checkUserIdExist(id) {
    const sql = `SELECT EXISTS (SELECT 1 FROM user where id=${id}) user`;
    const [result] = await sendQuery(sql);
    return /^1/.test(result['user']);
  }
}

export default new UserModel();
