import QueryBuilder from '/opt/common/query-builder';
import { CustomError, errorGenerator } from '/opt/common/custom-error';
import SQLManager from '/opt/common/SQLManager';

class UserModel {
  // admin
  public async addTempUser(userInfo) {
    const query = QueryBuilder.insertBuilder(userInfo, 'temporary_user');
    return await this.sendQuery(query);
  }

  public async listUsers() {
    const query = QueryBuilder.selectBuilder(['all'], 'user');
    const users = await this.sendQuery(query);
    return { users: users };
  }

  // User
  public async addUser(userInfo) {
    const query = QueryBuilder.insertBuilder(userInfo, 'user');
    const queryResult = await this.sendQuery(query);
    const userId = { ...queryResult }['insertId'];
    return { ...userInfo, id: userId };
  }

  public async getUserInfoById(id) {
    const query = QueryBuilder.selectBuilder(['all'], 'user', { id: `${id}` });
    const user = await this.sendQuery(query);
    return { user: user };
  }

  public async updateUserInfoById(userId, userInfo) {
    const query = QueryBuilder.updateBuilder(userId, userInfo, 'user');
    return await this.sendQuery(query);
    const queryResult = await this.sendQuery(query);
    return await this.getUserInfoById(userId);
  }

  public async getBuyerInfo(id) {
    // language=SQL format=false
    const query = `
    SELECT JSON_OBJECT(
      'address', JSON_OBJECT(
        'line1', address.address_line_1,
        'line2', address.address_line_2,
        'city', address.city,
        'province', address.province,
        'postalcode', address.postal_code
      ),
      'orders', JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', orders.id,
          'status', order_status.label,
          'products', (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', product.id,
                'name', product.name,
                'price', ROUND(product.price, 2),
                'description', product.description,
                'status', product_status.label,
                'img', product_multimedia.url
              )
            )
            FROM product
            LEFT JOIN order_item ON order_item.product_id = product.id
            LEFT JOIN product_multimedia ON product.id = product_multimedia.product_id
            JOIN shipping_status ON order_item.shipping_status_id = shipping_status.id
            JOIN product_status ON product.product_status_id = product_status.id
            WHERE order_item.order_id = orders.id
          ),
          'created_at', orders.created_at
        )
      )
    ) AS buyer_info
  FROM (select * from buyer where buyer.id=${id}) as buyer
  JOIN user ON user.id = buyer.id
  JOIN orders ON orders.buyer_id = buyer.id
  JOIN order_status ON orders.order_status_id = order_status.id
  JOIN address ON address.id = buyer.pref_address_id
  GROUP BY buyer.id;
    `;
    const queryResult = await this.sendQuery(query);
    const buyer = JSON.parse(queryResult![0].buyer_info);
    return { buyer: buyer };
  }

  public async getSellerInfo(sellerId) {
    const query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'id', product.id, 
      'name', product.name, 
      'price', ROUND(product.price, 2), 
      'description', product.description, 
      'status', product_status.label, 
      'img', product_multimedia.url)) as products
      FROM (select * from product ORDER BY product.id) as product
      LEFT JOIN product_multimedia ON product.id = product_multimedia.product_id 
      LEFT JOIN seller ON product.seller_id = seller.id
      JOIN product_status ON product.product_status_id = product_status.id 
      where seller.id = ${sellerId}
      GROUP BY seller.id;`;
    const queryResult = await this.sendQuery(query);
    return { seller: { products: JSON.parse(queryResult![0].products) } };
  }

  // Address
  public async getAddressesByUserId(userId) {
    const query =
      `SELECT ` +
      `JSON_OBJECT(` +
      `'id', preferred_address.id, ` +
      `'address_line_1', preferred_address.address_line_1, ` +
      `'address_line_2', preferred_address.address_line_2, ` +
      `'city', preferred_address.city, ` +
      `'province', preferred_address.province, ` +
      `'recipient', preferred_address.recipient, ` +
      `'telephone', preferred_address.telephone` +
      `) AS preferred_address, ` +
      `JSON_ARRAYAGG(JSON_OBJECT(` +
      `'id', other_address.id, ` +
      `'address_line_1', other_address.address_line_1, ` +
      `'address_line_2', other_address.address_line_2, ` +
      `'city', other_address.city, ` +
      `'province', other_address.province,` +
      `'recipient', other_address.recipient, ` +
      `'telephone', other_address.telephone` +
      `)) AS other_address ` +
      `FROM buyer ` +
      `LEFT JOIN address AS preferred_address ON buyer.pref_address_id = preferred_address.id ` +
      `LEFT JOIN address AS other_address ON buyer.id = other_address.user_id AND buyer.pref_address_id <> other_address.id ` +
      `WHERE buyer.id = ${userId};`;
    const queryResult = await this.sendQuery(query);
    const preferred_address = JSON.parse(queryResult![0].preferred_address);
    const other_address = JSON.parse(queryResult![0].other_address);
    const addresses = { preferred_address, other_address };
    return { addresses: addresses };
    //return queryResult;
  }

  public async getAddresses(adminId) {
    const query = QueryBuilder.selectBuilder(['all'], 'address');
    const addresses = await this.sendQuery(query);
    return { addresses: addresses };
  }

  public async getAddressByAddressId(userId, addressId) {
    const query = QueryBuilder.selectBuilder(['all'], 'address', {
      id: `${addressId}`,
    });
    const queryResult = await this.sendQuery(query);
    return { address: queryResult };
  }

  public async addAddress(userId, newAddress) {
    const updated = { ...newAddress };
    delete newAddress.preferred;

    const query = QueryBuilder.insertBuilder(
      { ...newAddress, user_id: userId },
      'address'
    );
    const queryResult = await this.sendQuery(query);
    const addressId = { ...queryResult }['insertId'];
    if (updated.preferred) {
      const query = QueryBuilder.updateBuilder(
        userId,
        { pref_address_id: addressId },
        'buyer'
      );
      await this.sendQuery(query);
    }
    return { id: addressId, preferred: updated.preferred, ...newAddress };
  }

  public async updateAddressById(userId, addressId, newAddress) {
    if (newAddress.preferred) {
      const query = QueryBuilder.updateBuilder(
        userId,
        { pref_address_id: addressId },
        'buyer'
      );
      await this.sendQuery(query);
    }
    const updated = { ...newAddress };
    delete newAddress.preferred;
    const query = QueryBuilder.updateBuilder(addressId, newAddress, 'address');
    const queryResult = await this.sendQuery(query);
    return updated;
  }

  public async deleteAddressById(userId, addressId) {
    const query = QueryBuilder.deleteBuilder({ id: `${addressId}` }, 'address');
    return await this.sendQuery(query);
  }

  // payment
  public async getPaymentInfoByUserId(userId) {
    const sql = `
      SELECT * FROM payment_method JOIN buyer ON payment_method.id = buyer.pref_pm_id where buyer.id = ${userId};`;
    const payment = await this.sendQuery(sql);
    return { payment: payment };
  }
  public async getPaymentInfoByPaymentId(userId, paymentId) {
    const query = QueryBuilder.selectBuilder(['all'], 'payment_method', {
      id: `${paymentId}`,
    });
    const payment = await this.sendQuery(query);
    return { payment: payment };
  }

  public async addPaymentByUserId(userId, paymentInfo) {
    const query = QueryBuilder.insertBuilder(paymentInfo, 'payment_method');
    const queryResult = await this.sendQuery(query);
    const paymentId = { ...queryResult }['insertId'];
    const updateQuery = QueryBuilder.updateBuilder(
      userId,
      { pref_pm_id: paymentId },
      'buyer'
    );
    const updateResult = await this.sendQuery(updateQuery);
    return paymentInfo;
  }

  public async updatePaymentById(userId, paymentInfo) {
    const query = QueryBuilder.updateBuilder(
      userId,
      paymentInfo,
      'payment_method'
    );
    const queryResult = await this.sendQuery(query);
    return paymentInfo;
  }

  public async deletePaymentById(userId, addressId) {
    const query = QueryBuilder.deleteBuilder(
      { id: `${addressId}` },
      'payment_method'
    );
    return await this.sendQuery(query);
  }
  public async checkIdExist(id: number, table: string) {
    const query = `SELECT EXISTS (SELECT 1 FROM ${table} where id=${id}) ${table}`;
    const result = await this.sendQuery(query);
    return result ? /^1/.test(result[0][`${table}`]) : false;
  }

  public async checkTableNotEmpty(table) {
    const query = `SELECT EXISTS (SELECT 1 FROM ${table}) ${table}`;
    const result = await this.sendQuery(query);
    return result ? /^1/.test(result[table]) : false;
  }

  public async checkBuyerHasPaymentInfo(userId: number) {
    const query = QueryBuilder.selectBuilder(['pref_pm_id'], 'buyer', {
      id: userId,
    });
    const paymentId = await this.sendQuery(query);
  }

  public async sendQuery(query: string, set?) {
    const result = await SQLManager.query(query, set);
    return result;
  }
}

export default new UserModel();
