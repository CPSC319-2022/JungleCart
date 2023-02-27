// eslint-disable-next-line @typescript-eslint/no-var-requires
const { queryPool, query } = require('/opt/nodejs/node_modules/sql-layer');
import {
  deleteBuilder,
  insertBuilder,
  selectBuilder,
  updateBuilder,
} from './queryBuilder';

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrorMessage() {
    return 'Something went wrong: ' + this.message;
  }
}

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
    try {
      const results = await queryPool(sql, set);
      return {
        statusCode: 201,
        body: results,
      };
    } catch (error) {
      const err = error as CustomError;
      return {
        statusCode: err.statusCode,
        body: err.message,
      };
    }
  }
}

export default new UserModel();
