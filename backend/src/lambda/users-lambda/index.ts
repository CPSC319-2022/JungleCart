/* eslint-disable @typescript-eslint/no-var-requires */
const {
  query,
  queryPool,
  Router,
  createConnection,
  createConnectionPool,
} = require('/opt/nodejs/node_modules/sql-layer');

const {
  insertBuilder,
  deleteBuilder,
  updateBuilder,
  selectBuilder,
} = require('/opt/nodejs/node_modules/queryBuilder-layer');
const { asyncWrap } = require('/opt/nodejs/node_modules/asyncWrap-layer');
//user layer
// const {
//   UserController,
//   asyncWrap,
// } = require('/opt/nodejs/node_modules/user-layer');
//const UserController = require('/opt/nodejs/node_modules/user-layer/controller');
//const asyncWrap = require('/opt/nodejs/node_modules/user-layer/async-wrap');

// not using layer
//const UserController = require('./UserController');
//const { asyncWrap } = require('./async-wrap');

//// temp everything into index
// err //

interface CustomErrorSetup {
  statusCode: number;
  message: string;
}
interface ICustomError extends Error {
  statusCode?: number;
  message: string;
}
class CustomError extends Error {
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

const errorGenerator = (obj: CustomErrorSetup) => {
  const error: ICustomError = new Error(obj.message);
  error.statusCode = obj.statusCode;
  throw error;
};
//

interface IUpdateAddressDto {
  id: number;
  preferred: boolean;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  province: string;
  postal_code: string;
  recipient: string;
  telephone: string;
}

/// model
const db = 'sqlDB';
class UserModel {
  // admin
  public async addTempUser(userInfo) {
    const sql = insertBuilder(userInfo, `${db}.temporary_user`);
    return await this.sendQueryPool(sql);
  }

  public async listUsers() {
    const sql = selectBuilder(['all'], `${db}.user`);
    return await this.sendQueryPool(sql);
  }

  // User
  public async addUser(userInfo) {
    const sql = insertBuilder(userInfo, `${db}.user`);
    return await this.sendQueryPool(sql);
  }

  public async getUserInfoById(id) {
    const sql = selectBuilder(['all'], `${db}.user`, { id: `${id}` });
    return await this.sendQueryPool(sql, [id]);
  }

  public async updateUserInfoById(id, userInfo) {
    const sql = updateBuilder(id, userInfo, `${db}.user`);
    return await this.sendQueryPool(sql);
  }

  public async getBuyerInfo(id) {
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
                'price', product.price,
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
    ) AS order_details
  FROM (select * from buyer where buyer.id=${id}) as buyer
  JOIN user ON user.id = buyer.id
  JOIN orders ON orders.buyer_id = buyer.id
  JOIN order_status ON orders.order_status_id = order_status.id
  JOIN address ON address.id = buyer.pref_address_id
  GROUP BY buyer.id;
    `;
    return await this.sendQueryPool(query);
  }

  public async getSellerInfo(sellerId) {
    const query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'id', product.id, 
      'name', product.name, 
      'price', product.price, 
      'description', product.description, 
      'status', product_status.label, 
      'img', product_multimedia.url)) as products
      FROM (select * from product ORDER BY product.id) as product
      LEFT JOIN product_multimedia ON product.id = product_multimedia.product_id 
      LEFT JOIN seller ON product.seller_id = seller.id
      JOIN product_status ON product.product_status_id = product_status.id 
      where seller.id = ${sellerId}
      GROUP BY seller.id;`;
    return await this.sendQueryPool(query);
  }

  // Address
  public async getAddressesByUserId(userId) {
    const sql =
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
    const queryResult = await this.sendQueryPool(sql);
    const statusCode = queryResult.statusCode;
    const preferred_address = JSON.parse(queryResult.body[0].preferred_address);
    const other_address = JSON.parse(queryResult.body[0].other_address);
    const addresses = { preferred_address, other_address };
    addresses.other_address = addresses.other_address.filter((address) => address.id !== null);
    return { statusCode, addresses };
    //return queryResult;
  }

  public async getAddresses(adminId) {
    const sql = selectBuilder(['all'], `${db}.address`);
    return await this.sendQueryPool(sql);
  }

  public async getAddressByAddressId(userId, addressId) {
    const sql = selectBuilder(['all'], `${db}.address`, { id: `${addressId}` });
    return await this.sendQueryPool(sql);
  }

  public async addAddress(addInfo) {
    const query = insertBuilder(addInfo, 'address');
    const queryResult = await this.sendQueryPool(query);
    const statusCode = queryResult.statusCode;
    const address = queryResult.body[0].address;
    return { statusCode, address };
  }

  public async updateAddressById(userId, addressId, newAddress) {
    if (newAddress.preferred) {
      const query = updateBuilder(userId, { pref_address_id: newAddress.id }, 'buyer');
      await this.sendQueryPool(query);
    }
    const updated = { ...newAddress };
    delete newAddress.preferred;
    delete newAddress.id;
    const query = updateBuilder(addressId, newAddress, 'address');
    const queryResult = await this.sendQueryPool(query);
    return { queryResult, updated };
  }

  public async deleteAddressById(userId, addressId) {
    const sql = deleteBuilder({ id: `${addressId}` }, `${db}.address`);
    return await this.sendQueryPool(sql);
  }

  // payment
  public async getPaymentInfoByUserId(userId) {
    const sql = ``;
    return await this.sendQueryPool(sql);
  }
  public async getPaymentInfoByPaymentId(userId, paymentId) {
    const sql = selectBuilder(['all'], `${db}.payment_method`, {
      id: `${paymentId}`,
    });
    return await this.sendQueryPool(sql);
  }

  public async addPaymentByUserId(userInfo, paymentInfo) {
    const sql = insertBuilder(paymentInfo, `${db}.payment_method`);
    return await this.sendQueryPool(sql);
  }

  public async updatePaymentById(id, info) {
    const sql = updateBuilder(id, info, `${db}.payment_method`);
    return await this.sendQueryPool(sql);
  }

  public async deletePaymentById(userId, addressId) {
    const sql = deleteBuilder({ id: `${addressId}` }, `${db}.payment_method`);
    return await this.sendQueryPool(sql);
  }
  public async checkIdExist(id: number, table: string) {
    const sql = `SELECT EXISTS (SELECT 1 FROM ${table} where id=${id}) ${table}`;
    const result = await this.sendQueryPool(sql);
    return /^1/.test(result.body[0][`${table}`]);
  }

  private async sendQueryPool(sql: string, set?) {
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

  public async sendQuery(sql: string, set?) {
    try {
      const results = await query(sql, set);
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

const userModel = new UserModel();
// service
class UserService {
  //  private userModel: UserModel;
  constructor() {
    //this.userModel = new UserModel();
  }
  // admin
  public async listUsers() {
    return await userModel.listUsers();
  }

  public async addTempUser(newUser) {
    return await userModel.addTempUser(newUser);
  }

  // user
  public async addUser(info) {
    return await userModel.addUser(info);
  }

  public async updateUserInfoById(id, info) {
    return await userModel.updateUserInfoById(id, info);
  }

  public async getUserInfoById(userId: number) {
    await this.checkIdExist(userId, 'user');
    return await userModel.getUserInfoById(userId);
  }

  public async getBuyerInfo(buyerId) {
    await this.checkIdExist(buyerId, 'buyer');
    return await userModel.getBuyerInfo(buyerId);
  }

  public async getSellerInfo(sellerId) {
    await this.checkIdExist(sellerId, 'seller');
    return await userModel.getSellerInfo(sellerId);
  }

  // address

  public async getAddresses(id) {
    return await userModel.getAddresses(id);
  }

  public async getAddressesByUserId(userId) {
    await this.checkIdExist(userId, 'user');
    return await userModel.getAddressesByUserId(userId);
  }

  public async getAddressByAddressId(userId, addressId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    return await userModel.getAddressByAddressId(userId, addressId);
  }

  public async deleteAddressById(userId, addressId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    return await userModel.deleteAddressById(userId, addressId);
  }

  public async updateAddressById(userId, addressId, addressInfo) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    const newAddress: IUpdateAddressDto = this.validUpdateAddressDto(addressInfo);
    return await userModel.updateAddressById(userId, addressId, newAddress);
  }

  private validUpdateAddressDto(addressInfo) {
    if (this.isEmpty(addressInfo) || this.isEmpty(addressInfo['address'])) {
      errorGenerator({ statusCode: 400, message: 'Invalid Request. check req body: ' + addressInfo });
    }
    if (
      typeof addressInfo.address.id !== 'number' ||
      typeof addressInfo.address.preferred !== 'boolean' ||
      typeof addressInfo.address.address_line_1 !== 'string' ||
      (addressInfo.address.address_line_2 !== null && typeof addressInfo.address.address_line_2 !== 'string') ||
      typeof addressInfo.address.city !== 'string' ||
      typeof addressInfo.address.province !== 'string' ||
      typeof addressInfo.address.postal_code !== 'string' ||
      typeof addressInfo.address.recipient !== 'string' ||
      typeof addressInfo.address.telephone !== 'string'
    ) {
      errorGenerator({ statusCode: 400, message: 'Invalid Request. req body is not in format' });
    }
    return addressInfo.address;
  }
  public async addAddress(addressInfo) {
    const newAddress: IUpdateAddressDto = this.validUpdateAddressDto(addressInfo);
    return await userModel.addAddress(newAddress);
  }

  // payment
  public async getPaymentInfoByUserId(userId) {
    await this.checkIdExist(userId, 'user');
    return await userModel.getPaymentInfoByUserId(userId);
  }

  public async getPaymentInfoByPaymentId(userId, paymentId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(paymentId, 'payment_method');

    return await userModel.getPaymentInfoByPaymentId(userId, paymentId);
  }

  public async addPaymentByUserId(userId, paymentInfo) {
    await this.checkIdExist(userId, 'user');
    return await userModel.addPaymentByUserId(userId, paymentInfo);
  }

  public async deletePaymentById(userId, paymentId) {
    await this.checkIdExist(paymentId, 'payment_method');
    return await userModel.deletePaymentById(userId, paymentId);
  }

  public async updatePaymentById(paymentId, paymentInfo) {
    await this.checkIdExist(paymentId, 'payment_method');
    return await userModel.updatePaymentById(paymentId, paymentInfo);
  }

  private async checkIdExist(id: number, table: string) {
    const result = await userModel.checkIdExist(id, table);
    if (!result) {
      errorGenerator({
        message: `INVALID REQUEST: ${table} ${id} not exist`,
        statusCode: 422,
      });
    }
    return;
  }

  private isEmpty(obj: Record<string, unknown>) {
    return Object.keys(obj || {}).length === 0;
  }
}

////

const userService = new UserService();
/// controller

class UserController {
  constructor() {
    //this.userService = new UserService();
  }
  //admin
  public async listUsers(event): Promise<response> {
    const users = await userService.listUsers();
    return { statusCode: 200, body: users };
  }

  public async addTempUser(event) {
    const newUser = JSON.parse(event.body);
    const user = await userService.addTempUser(newUser);
    return { statusCode: 200, body: user };
  }

  // user
  public async addUser(event) {
    const newUser = JSON.parse(event.body);
    const user = await userService.addUser(newUser);
    return { statusCode: 200, body: user };
  }

  public async getUserInfoById(event): Promise<response> {
    const userId = event.pathParameters.userId;
    const user = await userService.getUserInfoById(Number(userId));
    return { statusCode: 200, body: user };
  }

  public async updateUserInfoById(event) {
    const userInfo = JSON.parse(event.body);
    const userId = Number(event.pathParameters.userId);
    await userService.updateUserInfoById(userId, userInfo);
    return {
      statusCode: 200,
      body: { message: 'updated user info' },
    };
  }

  public async getBuyerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const buyer = await userService.getBuyerInfo(userId);
    return { statusCode: 200, body: buyer };
  }

  public async getSellerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const seller = await userService.getSellerInfo(userId);
    return { statusCode: 200, body: seller };
  }

  // Address
  public async getAddresses(event) {
    const userId = event.pathParameters.userId;
    const addresses = await userService.getAddresses(userId);
    return { statusCode: 200, body: addresses };
  }

  public async getAddressesByUserId(event) {
    const userId = event.pathParameters.userId;
    const result = await userService.getAddressesByUserId(userId);
    return { statusCode: result.statusCode, body: result.addresses };
  }

  public async getAddressByAddressId(event) {
    const { userId, addressId } = event.pathParameters;
    const address = await userService.getAddressByAddressId(userId, addressId);
    return { statusCode: 200, body: address };
  }

  public async addAddress(event) {
    const { userId } = event.pathParameters;
    const newAddress = JSON.parse(event.body);
    const addressId = await userService.addAddress(newAddress);
    return { statusCode: 200, body: addressId };
  }

  public async deleteAddressById(event) {
    const { userId, addressId } = event.pathParameters;
    await userService.deleteAddressById(userId, addressId);
    return { statusCode: 200, body: { message: 'deleted address' } };
  }

  public async updateAddressById(event) {
    const { userId, addressId } = event.pathParameters;
    const addInfo = JSON.parse(event.body);
    const result = await userService.updateAddressById(userId, addressId, addInfo);
    return {
      statusCode: result.queryResult.statusCode,
      body: {
        message: 'updated address.',
        address: result.updated,
      },
    };
  }

  // payment
  public async getPaymentInfoByUserId(event) {
    const userId = event.pathParameters.userId;
    const payment = await userService.getPaymentInfoByUserId(userId);
    return { statusCode: 200, body: payment };
  }

  public async getPaymentInfoByPaymentId(event) {
    const { userId, paymentId } = event.pathParameters;
    const payment = await userService.getPaymentInfoByPaymentId(userId, paymentId);
    return { statusCode: 200, body: payment };
  }

  public async addPaymentByUserId(event) {
    const userId = event.pathParameters.userId;
    const paymentInfo = JSON.parse(event.body);
    const paymentId = await userService.addPaymentByUserId(userId, paymentInfo);
    return { statusCode: 200, body: paymentId };
  }

  public async deletePaymentById(event) {
    const { userId, paymentId } = event.pathParameters;
    await userService.deletePaymentById(userId, paymentId);
    return { statusCode: 200, body: { message: 'deleted payment' } };
  }

  public async updatePaymentById(event) {
    const { userId, paymentId } = event.pathParameters;
    const paymentInfo = JSON.parse(event.body);
    await userService.updatePaymentById(paymentId, paymentInfo);
    return { statusCode: 200, body: { message: 'updated address' } };
  }
}

///

const router = new Router();
const userController = new UserController();
//// router

// admin
router.get('/users', asyncWrap(userController.listUsers)); //admin
router.post('/users', asyncWrap(userController.addUser)); // admin

// user
router.put('/users/{userId}', asyncWrap(userController.updateUserInfoById));
router.get('/users/{userId}', asyncWrap(userController.getUserInfoById));

router.get('/users/{userId}/seller', asyncWrap(userController.getSellerInfo));
router.get('/users/{userId}/buyer', asyncWrap(userController.getBuyerInfo));

// address
router.get('/users/{userId}/addresses', asyncWrap(userController.getAddressesByUserId));
router.post('/users/{userId}/addresses', asyncWrap(userController.addAddress));
router.get('/users/{userId}/addresses/{addressId}', asyncWrap(userController.getAddressByAddressId));
router.delete('/users/{userId}/addresses/{addressId}', asyncWrap(userController.deleteAddressById));
router.put('/users/{userId}/addresses/{addressId}', asyncWrap(userController.updateAddressById));

// payment
router.get('/users/{userId}/payments', asyncWrap(userController.getPaymentInfoByUserId));
router.post('/users/{userId}/payments', asyncWrap(userController.addPaymentByUserId));
router.put('/users/{userId}/payments/{paymentId}', asyncWrap(userController.updatePaymentById));
router.delete('/users/{userId}/payments/{paymentId}', asyncWrap(userController.deletePaymentById));

// DATABASE CONNECTON : LOCAL
// createConnection(
//   databaseLocal.mysql.host,
//   databaseLocal.mysql.user,
//   databaseLocal.mysql.password,
//   databaseLocal.mysql.port,
//   databaseLocal.mysql.database
// );

// DATABASE CONNECTION : RDS
// createConnection(
//   process.env.RDS_HOSTNAME,
//   process.env.RDS_USERNAME,
//   process.env.RDS_PASSWORD,
//   process.env.RDS_PORT,
//   process.env.RDS_DB
// );

createConnectionPool(
  process.env.RDS_HOSTNAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  process.env.RDS_PORT || '3306',
  process.env.RDS_DB || 'sqlDB'
);

// handles routing and sends request
exports.handler = async function (event) {
  console.log('<TEST::: USER STACK >');
  console.log('<event ::: ', event);
  console.log('<event body ::: ', event.body);
  const handlerResult = await router.route(event);
  //console.log('handlerResult ::: ', handlerResult);
  return handlerResult;
};

// handles routing and sends request
//exports.handler = asyncWrap(async function (event) {
//  return await router.route(event);
//});
