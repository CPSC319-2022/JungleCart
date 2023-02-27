/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('/opt/nodejs/node_modules/sql-layer');
//const {
//   deleteBuilder,
//   insertBuilder,
//   selectBuilder,
//   updateBuilder,
// } = require('/opt/nodejs/node-modules/queryBuilder');

const { queryBuilder } = require('/opt/nodejs/node-modules/user-layer');
class UserModel {
  public async addUser(userInfo) {
    const sql = queryBuilder.insertBuilder(userInfo, 'user');
    return await this.sendQuery(sql);
  }

  public async listUsers() {
    const sql = queryBuilder.selectBuilder(['all'], 'user');
    return await this.sendQuery(sql);
  }

  public async getUserInfoById(id) {
    const sql = queryBuilder.selectBuilder(['all'], 'user', { id: `${id}` });
    return await this.sendQuery(sql, [id]);
  }

  public async updateUserInfoById(id, userInfo) {
    const sql = queryBuilder.updateBuilder(id, userInfo, 'user');
    return await this.sendQuery(sql);
  }

  // Address
  public async getAddressesByUserId(user_id) {
    const sql = queryBuilder.selectBuilder(['all'], 'address', {
      user_id: `${user_id}`,
    });
    return await this.sendQuery(sql);
  }

  public async getAddresses(id) {
    const sql = queryBuilder.selectBuilder(['all'], 'address', { id: `${id}` });
    return await this.sendQuery(sql);
  }

  public async addAddress(addInfo) {
    const sql = queryBuilder.insertBuilder(addInfo, 'address');
    return await this.sendQuery(sql);
  }

  public async updateAddressById(id, info) {
    const sql = queryBuilder.updateBuilder(id, info, 'address');
    return await this.sendQuery(sql);
  }

  public async deleteAddressById(userId, addressId) {
    const sql = queryBuilder.deleteBuilder({ id: `${addressId}` }, 'address');
    return await this.sendQuery(sql);
  }

  public async getBuyerInfo(id) {
    return {};
  }

  public async getSellerInfo(id) {
    return {};
  }

  public async checkUserIdExist(id) {
    const sql = `SELECT EXISTS (SELECT 1 FROM user where id=${id}) user`;
    const [result] = await this.sendQuery(sql);
    return /^1/.test(result['user']);
  }

  private async sendQuery(sql: string, set?) {
    return query(sql, set)
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

export default new UserModel();
