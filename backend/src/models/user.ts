// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('/opt/nodejs/node_modules/sql-layer');
const {
  deleteBuilder,
  insertBuilder,
  selectBuilder,
  updateBuilder,
} = require('./queryBuilder');

class UserModel {
  public async addUser(userInfo) {
    const sql = insertBuilder(userInfo, 'user');
    return await this.sendQuery(sql);
  }

  public async listUsers() {
    const sql = selectBuilder(['all'], 'user');
    return await this.sendQuery(sql);
  }

  public async getUserInfoById(id) {
    const sql = selectBuilder(['all'], 'user', { id: `${id}` });
    return await this.sendQuery(sql, [id]);
  }

  public async updateUserInfoById(id, userInfo) {
    const sql = updateBuilder(id, userInfo, 'user');
    return await this.sendQuery(sql);
  }

  // Address
  public async getAddressesByUserId(user_id) {
    const sql = selectBuilder(['all'], 'address', { user_id: `${user_id}` });
    return await this.sendQuery(sql);
  }

  public async getAddresses(id) {
    const sql = selectBuilder(['all'], 'address', { id: `${id}` });
    return await this.sendQuery(sql);
  }

  public async addAddress(addInfo) {
    const sql = insertBuilder(addInfo, 'address');
    return await this.sendQuery(sql);
  }

  public async updateAddressById(id, info) {
    const sql = updateBuilder(id, info, 'address');
    return await this.sendQuery(sql);
  }

  public async deleteAddressById(userId, addressId) {
    const sql = deleteBuilder({ id: `${addressId}` }, 'address');
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
