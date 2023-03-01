/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query, queryPool } = require('/opt/nodejs/node_modules/sql-layer');
const {
  insertBuilder,
  deleteBuilder,
  updateBuilder,
  selectBuilder,
} = require('/opt/nodejs/node_modules/queryBuilder-layer');
import * as console from 'console';
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.RDS_DB || 'sqlDB';

class UserModel {
  public async addUser(userInfo) {
    const sql = insertBuilder(userInfo, `${db}.user`);
    return await this.sendQuery(sql);
  }

  public async listUsers() {
    const sql = selectBuilder(['all'], `${db}.user`);
    return await this.sendQuery(sql);
  }

  public async getUserInfoById(id) {
    const sql = selectBuilder(['all'], `${db}.user`, { id: `${id}` });
    return await this.sendQuery(sql, [id]);
  }

  public async updateUserInfoById(id, userInfo) {
    const sql = updateBuilder(id, userInfo, `${db}.user`);
    return await this.sendQuery(sql);
  }

  // Address
  public async getAddressesByUserId(user_id) {
    const sql = selectBuilder(['all'], `${db}.address`, {
      user_id: `${user_id}`,
    });
    return await this.sendQuery(sql);
  }

  public async getAddresses(id) {
    const sql = selectBuilder(['all'], `${db}.address`, { id: `${id}` });
    return await this.sendQuery(sql);
  }

  public async addAddress(addInfo) {
    const sql = insertBuilder(addInfo, `${db}.address`);
    return await this.sendQuery(sql);
  }

  public async updateAddressById(id, info) {
    const sql = updateBuilder(id, info, `${db}.address`);
    return await this.sendQuery(sql);
  }

  public async deleteAddressById(userId, addressId) {
    const sql = deleteBuilder({ id: `${addressId}` }, `${db}.address`);
    return await this.sendQuery(sql);
  }

  public async getBuyerInfo(id) {
    return {};
  }

  public async getSellerInfo(id) {
    return {};
  }

  public async checkUserIdExist(id) {
    const sql = `SELECT EXISTS (SELECT 1 FROM ${db}.user where id=${id}) ${db}.user`;
    const result = await this.sendQuery(sql);
    console.log(result);
    return /^1/.test(result['user']);
  }

  private async sendQuery1(sql: string, set?) {
    return await queryPool(sql, set)
      .then((results) => ({
        statusCode: 201,
        body: results,
      }))
      .catch((error) => ({
        statusCode: error.statusCode,
        body: error.message,
      }));
  }

  private async sendQuery(sql: string, set?) {
    return queryPool(sql, set)
      .then((results) => ({
        statusCode: 201,
        body: results,
      }))
      .catch((error) => ({
        statusCode: error.statusCode,
        body: error.message,
      }));
  }
}

export const userModel = new UserModel();
