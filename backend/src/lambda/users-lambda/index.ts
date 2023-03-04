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
const {
  ICustomErrorSetup,
  ICustomError,
  CustomError,
  errorGenerator,
} = require('/opt/nodejs/node_modules/customError-layer');
//const { UserController } = require('/opt/nodejs/node_modules/user-layer');
const { UserController } = require('./UserController');
const userController = new UserController();
const router = new Router();

//// router

// admin
router.get('/users', asyncWrap(userController.listUsers));
router.post('/users', asyncWrap(userController.addUser));

// user
router.put('/users/{userId}', asyncWrap(userController.updateUserInfoById));
router.get('/users/{userId}', asyncWrap(userController.getUserInfoById));

router.get('/users/{userId}/seller', asyncWrap(userController.getSellerInfo));
router.get('/users/{userId}/buyer', asyncWrap(userController.getBuyerInfo));

// address
router.get(
  '/users/{userId}/addresses',
  asyncWrap(userController.getAddressesByUserId)
);
router.post('/users/{userId}/addresses', asyncWrap(userController.addAddress));
router.get(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(userController.getAddressByAddressId)
);
router.delete(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(userController.deleteAddressById)
);
router.put(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(userController.updateAddressById)
);

// payment
router.get(
  '/users/{userId}/payments',
  asyncWrap(userController.getPaymentInfoByUserId)
);
router.post(
  '/users/{userId}/payments',
  asyncWrap(userController.addPaymentByUserId)
);
router.put(
  '/users/{userId}/payments/{paymentId}',
  asyncWrap(userController.updatePaymentById)
);
router.delete(
  '/users/{userId}/payments/{paymentId}',
  asyncWrap(userController.deletePaymentById)
);

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
  console.log('handlerResult ::: ', handlerResult);
  return handlerResult;
};

//user layer
//const UserController = require('/opt/nodejs/node_modules/user-layer');
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

/// model
// class UserModel {
//   // admin
//   public async addTempUser(userInfo) {
//     const sql = insertBuilder(userInfo, 'temporary_user');
//     return await this.sendQueryPool(sql);
//   }

//   public async listUsers() {
//     const sql = selectBuilder(['all'], 'user');
//     const users = await this.sendQueryPool(sql);
//     return { users: users };
//   }

//   // User
//   public async addUser(userInfo) {
//     const sql = insertBuilder(userInfo, 'user');
//     return await this.sendQueryPool(sql);
//   }

//   public async getUserInfoById(id) {
//     const sql = selectBuilder(['all'], 'user', { id: `${id}` });
//     const user = await this.sendQueryPool(sql, [id]);
//     return { user: user };
//   }

//   public async updateUserInfoById(userId, userInfo) {
//     const sql = updateBuilder(userId, userInfo, 'user');
//     return await this.sendQueryPool(sql);
//     const queryResult = await this.sendQueryPool(query);
//     return await this.getUserInfoById(userId);
//   }

//   public async getBuyerInfo(id) {
//     const query = `
//     SELECT JSON_OBJECT(
//       'address', JSON_OBJECT(
//         'line1', address.address_line_1,
//         'line2', address.address_line_2,
//         'city', address.city,
//         'province', address.province,
//         'postalcode', address.postal_code
//       ),
//       'orders', JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'id', orders.id,
//           'status', order_status.label,
//           'products', (
//             SELECT JSON_ARRAYAGG(
//               JSON_OBJECT(
//                 'id', product.id,
//                 'name', product.name,
//                 'price', ROUND(product.price, 2),
//                 'description', product.description,
//                 'status', product_status.label,
//                 'img', product_multimedia.url
//               )
//             )
//             FROM product
//             LEFT JOIN order_item ON order_item.product_id = product.id
//             LEFT JOIN product_multimedia ON product.id = product_multimedia.product_id
//             JOIN shipping_status ON order_item.shipping_status_id = shipping_status.id
//             JOIN product_status ON product.product_status_id = product_status.id
//             WHERE order_item.order_id = orders.id
//           ),
//           'created_at', orders.created_at
//         )
//       )
//     ) AS buyer_info
//   FROM (select * from buyer where buyer.id=${id}) as buyer
//   JOIN user ON user.id = buyer.id
//   JOIN orders ON orders.buyer_id = buyer.id
//   JOIN order_status ON orders.order_status_id = order_status.id
//   JOIN address ON address.id = buyer.pref_address_id
//   GROUP BY buyer.id;
//     `;
//     const queryResult = await this.sendQueryPool(query);
//     const buyerInfo = JSON.parse(queryResult[0].buyer_info);
//     return { buyerInfo: buyerInfo };
//   }

//   public async getSellerInfo(sellerId) {
//     const query = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
//       'id', product.id,
//       'name', product.name,
//       'price', ROUND(product.price, 2),
//       'description', product.description,
//       'status', product_status.label,
//       'img', product_multimedia.url)) as products
//       FROM (select * from product ORDER BY product.id) as product
//       LEFT JOIN product_multimedia ON product.id = product_multimedia.product_id
//       LEFT JOIN seller ON product.seller_id = seller.id
//       JOIN product_status ON product.product_status_id = product_status.id
//       where seller.id = ${sellerId}
//       GROUP BY seller.id;`;
//     const queryResult = await this.sendQueryPool(query);
//     return { products: JSON.parse(queryResult[0].products) };
//   }

//   // Address
//   public async getAddressesByUserId(userId) {
//     const sql =
//       `SELECT ` +
//       `JSON_OBJECT(` +
//       `'id', preferred_address.id, ` +
//       `'address_line_1', preferred_address.address_line_1, ` +
//       `'address_line_2', preferred_address.address_line_2, ` +
//       `'city', preferred_address.city, ` +
//       `'province', preferred_address.province, ` +
//       `'recipient', preferred_address.recipient, ` +
//       `'telephone', preferred_address.telephone` +
//       `) AS preferred_address, ` +
//       `JSON_ARRAYAGG(JSON_OBJECT(` +
//       `'id', other_address.id, ` +
//       `'address_line_1', other_address.address_line_1, ` +
//       `'address_line_2', other_address.address_line_2, ` +
//       `'city', other_address.city, ` +
//       `'province', other_address.province,` +
//       `'recipient', other_address.recipient, ` +
//       `'telephone', other_address.telephone` +
//       `)) AS other_address ` +
//       `FROM buyer ` +
//       `LEFT JOIN address AS preferred_address ON buyer.pref_address_id = preferred_address.id ` +
//       `LEFT JOIN address AS other_address ON buyer.id = other_address.user_id AND buyer.pref_address_id <> other_address.id ` +
//       `WHERE buyer.id = ${userId};`;
//     const queryResult = await this.sendQueryPool(sql);
//     const preferred_address = JSON.parse(queryResult[0].preferred_address);
//     const other_address = JSON.parse(queryResult[0].other_address);
//     const addresses = { preferred_address, other_address };
//     return { addresses: addresses };
//     //return queryResult;
//   }

//   public async getAddresses(adminId) {
//     const sql = selectBuilder(['all'], 'address');
//     const addresses = await this.sendQueryPool(sql);
//     return { addresses: addresses };
//   }

//   public async getAddressByAddressId(userId, addressId) {
//     const sql = selectBuilder(['all'], 'address', { id: `${addressId}` });
//     const queryResult = await this.sendQueryPool(sql);
//     return { address: queryResult };
//   }

//   public async addAddress(userId, newAddress) {
//     const updated = { ...newAddress };
//     delete newAddress.preferred;

//     const query = insertBuilder({ ...newAddress, user_id: userId }, 'address');
//     const queryResult = await this.sendQueryPool(query);
//     const addressId = { ...queryResult }['insertId'];
//     if (updated.preferred) {
//       const query = updateBuilder(
//         userId,
//         { pref_address_id: newAddress.id },
//         'buyer'
//       );
//       await this.sendQueryPool(query);
//     }
//     return { address: { ...newAddress, id: addressId } };
//   }

//   public async updateAddressById(userId, addressId, newAddress) {
//     if (newAddress.preferred) {
//       const query = updateBuilder(
//         userId,
//         { pref_address_id: addressId },
//         'buyer'
//       );
//       await this.sendQueryPool(query);
//     }
//     const updated = { ...newAddress };
//     delete newAddress.preferred;
//     const query = updateBuilder(addressId, newAddress, 'address');
//     const queryResult = await this.sendQueryPool(query);
//     return updated;
//   }

//   public async deleteAddressById(userId, addressId) {
//     const sql = deleteBuilder({ id: `${addressId}` }, 'address');
//     return await this.sendQueryPool(sql);
//   }

//   // payment
//   public async getPaymentInfoByUserId(userId) {
//     const sql = `
//       SELECT * FROM payment_method JOIN buyer ON payment_method.id = buyer.pref_pm_id where buyer.id = ${userId};`;
//     const payment = await this.sendQueryPool(sql);
//     return { payment: payment };
//   }
//   public async getPaymentInfoByPaymentId(userId, paymentId) {
//     const sql = selectBuilder(['all'], 'payment_method', {
//       id: `${paymentId}`,
//     });
//     const payment = await this.sendQueryPool(sql);
//     return { payment: payment };
//   }

//   public async addPaymentByUserId(userInfo, paymentInfo) {
//     const sql = insertBuilder(paymentInfo, 'payment_method');
//     return await this.sendQueryPool(sql);
//   }

//   public async updatePaymentById(id, info) {
//     const sql = updateBuilder(id, info, 'payment_method');
//     return await this.sendQueryPool(sql);
//   }

//   public async deletePaymentById(userId, addressId) {
//     const sql = deleteBuilder({ id: `${addressId}` }, 'payment_method');
//     return await this.sendQueryPool(sql);
//   }
//   public async checkIdExist(id: number, table: string) {
//     const sql = `SELECT EXISTS (SELECT 1 FROM ${table} where id=${id}) ${table}`;
//     const result = await this.sendQueryPool(sql);
//     return /^1/.test(result[0][`${table}`]);
//   }

//   public async sendQueryPool(sql: string, set?) {
//     try {
//       const result = await queryPool(sql, set);
//       return result;
//     } catch (error) {
//       const err = error as typeof CustomError;
//       errorGenerator(err.statusCode, err.message);
//     }
//   }
// }

//const userModel = new UserModel();
// service
// class UserService {
//   //  private userModel: UserModel;
//   constructor() {
//     //this.userModel = new UserModel();
//   }
//   // admin
//   public async listUsers() {
//     return await userModel.listUsers();
//   }

//   public async addTempUser(newUser) {
//     return await userModel.addTempUser(newUser);
//   }

//   // user
//   public async addUser(info) {
//     return await userModel.addUser(info);
//   }

//   public async updateUserInfoById(userId, userInfo) {
//     await this.checkIdExist(userId, 'user');
//     await this.validUpdateUserDto(userInfo);
//     return await userModel.updateUserInfoById(userId, userInfo);
//   }

//   public async getUserInfoById(userId: number) {
//     await this.checkIdExist(userId, 'user');
//     return await userModel.getUserInfoById(userId);
//   }

//   public async getBuyerInfo(buyerId) {
//     await this.checkIdExist(buyerId, 'buyer');
//     return await userModel.getBuyerInfo(buyerId);
//   }

//   public async getSellerInfo(sellerId) {
//     await this.checkIdExist(sellerId, 'seller');
//     return await userModel.getSellerInfo(sellerId);
//   }

//   // address

//   public async getAddresses(id) {
//     await this.checkIdExist(id, 'address ');
//     return await userModel.getAddresses(id);
//   }

//   public async getAddressesByUserId(userId) {
//     await this.checkIdExist(userId, 'user');
//     return await userModel.getAddressesByUserId(userId);
//   }

//   public async getAddressByAddressId(userId, addressId) {
//     await this.checkIdExist(userId, 'user');
//     await this.checkIdExist(addressId, 'address');
//     return await userModel.getAddressByAddressId(userId, addressId);
//   }

//   public async deleteAddressById(userId, addressId) {
//     await this.checkIdExist(userId, 'user');
//     await this.checkIdExist(addressId, 'address');
//     return await userModel.deleteAddressById(userId, addressId);
//   }

//   public async updateAddressById(userId, addressId, addressInfo) {
//     await this.checkIdExist(userId, 'user');
//     await this.checkIdExist(addressId, 'address');
//     const newAddress: typeof IUpdateAddressDto =
//       this.validUpdateAddressDto(addressInfo);
//     return await userModel.updateAddressById(userId, addressId, newAddress);
//   }

//   public async addAddress(userId, addressInfo) {
//     this.checkIdExist(userId, 'user');
//     const newAddress: typeof IUpdateAddressDto =
//       this.validUpdateAddressDto(addressInfo);
//     return await userModel.addAddress(userId, newAddress);
//   }

//   private validUpdateUserDto(userInfo) {
//     // TODO
//     if (this.isEmpty(userInfo)) {
//       errorGenerator({
//         statusCode: 400,
//         message: 'Invalid Request. check req body ' + userInfo,
//       });
//     }
//     return;
//   }

//   private validUpdateAddressDto(addressInfo) {
//     if (this.isEmpty(addressInfo) || this.isEmpty(addressInfo['address'])) {
//       errorGenerator({
//         statusCode: 400,
//         message: 'Invalid Request. check req body: ' + addressInfo,
//       });
//     }
//     if (
//       typeof addressInfo.address.preferred !== 'boolean' ||
//       typeof addressInfo.address.address_line_1 !== 'string' ||
//       (addressInfo.address.address_line_2 !== null &&
//         typeof addressInfo.address.address_line_2 !== 'string') ||
//       typeof addressInfo.address.city !== 'string' ||
//       typeof addressInfo.address.province !== 'string' ||
//       typeof addressInfo.address.postal_code !== 'string' ||
//       typeof addressInfo.address.recipient !== 'string' ||
//       typeof addressInfo.address.telephone !== 'string'
//     ) {
//       errorGenerator({
//         statusCode: 400,
//         message: 'Invalid Request. req body is not in format',
//       });
//     }
//     return addressInfo.address;
//   }

//   // payment
//   public async getPaymentInfoByUserId(userId) {
//     await this.checkIdExist(userId, 'user');
//     return await userModel.getPaymentInfoByUserId(userId);
//   }

//   public async getPaymentInfoByPaymentId(userId, paymentId) {
//     await this.checkIdExist(userId, 'user');
//     await this.checkIdExist(paymentId, 'payment_method');

//     return await userModel.getPaymentInfoByPaymentId(userId, paymentId);
//   }

//   public async addPaymentByUserId(userId, paymentInfo) {
//     await this.checkIdExist(userId, 'user');
//     return await userModel.addPaymentByUserId(userId, paymentInfo);
//   }

//   public async deletePaymentById(userId, paymentId) {
//     await this.checkIdExist(paymentId, 'payment_method');
//     return await userModel.deletePaymentById(userId, paymentId);
//   }

//   public async updatePaymentById(paymentId, paymentInfo) {
//     await this.checkIdExist(paymentId, 'payment_method');
//     return await userModel.updatePaymentById(paymentId, paymentInfo);
//   }

//   private async checkIdExist(id: number, table: string) {
//     const result = await userModel.checkIdExist(id, table);
//     if (!result) {
//       errorGenerator({
//         message: `INVALID REQUEST: ${table} ${id} not exist`,
//         statusCode: 422,
//       });
//     }
//     return;
//   }

//   private isEmpty(obj: Record<string, unknown>) {
//     return Object.keys(obj || {}).length === 0;
//   }
// }

// ////

// const userService = new UserService();
// /// controller

// class UserController {
//   constructor() {
//     //this.userService = new UserService();
//   }
//   //admin
//   public async listUsers(event) {
//     const users = await userService.listUsers();
//     return { statusCode: 200, body: users };
//   }

//   public async addTempUser(event) {
//     const newUser = JSON.parse(event.body);
//     const user = await userService.addTempUser(newUser);
//     return { statusCode: 200, body: user };
//   }

//   // user
//   public async addUser(event) {
//     const newUser = JSON.parse(event.body);
//     const user = await userService.addUser(newUser);
//     return { statusCode: 200, body: user };
//   }

//   public async getUserInfoById(event) {
//     const userId = event.pathParameters.userId;
//     const user = await userService.getUserInfoById(userId);
//     return { statusCode: 200, body: user };
//   }

//   public async updateUserInfoById(event) {
//     const userInfo = JSON.parse(event.body);
//     const userId = Number(event.pathParameters.userId);
//     const updatedUserInfo = await userService.updateUserInfoById(
//       userId,
//       userInfo
//     );
//     return {
//       statusCode: 200,
//       body: {
//         message: 'updated user info',
//         address: updatedUserInfo,
//       },
//     };
//   }

//   public async getBuyerInfo(event) {
//     const userId = Number(event.pathParameters.userId);
//     const buyer = await userService.getBuyerInfo(userId);
//     return { statusCode: 200, body: buyer };
//   }

//   public async getSellerInfo(event) {
//     const userId = Number(event.pathParameters.userId);
//     const seller = await userService.getSellerInfo(userId);
//     return { statusCode: 200, body: seller };
//   }

//   // Address
//   public async getAddresses(event) {
//     const userId = event.pathParameters.userId;
//     const addresses = await userService.getAddresses(userId);
//     return { statusCode: 200, body: addresses };
//   }

//   public async getAddressesByUserId(event) {
//     const userId = event.pathParameters.userId;
//     const addresses = await userService.getAddressesByUserId(userId);
//     return { statusCode: 200, body: addresses };
//   }

//   public async getAddressByAddressId(event) {
//     const { userId, addressId } = event.pathParameters;
//     const address = await userService.getAddressByAddressId(userId, addressId);
//     return { statusCode: 200, body: address };
//   }

//   public async addAddress(event) {
//     const { userId } = event.pathParameters;
//     const addressReq = JSON.parse(event.body);
//     const newAddress = await userService.addAddress(userId, addressReq);
//     return {
//       statusCode: 200,
//       body: {
//         message: 'updated address.',
//         address: newAddress,
//       },
//     };
//   }

//   public async deleteAddressById(event) {
//     const { userId, addressId } = event.pathParameters;
//     await userService.deleteAddressById(userId, addressId);
//     return { statusCode: 200, body: { message: 'deleted address' } };
//   }

//   public async updateAddressById(event) {
//     const { userId, addressId } = event.pathParameters;
//     const addInfo = JSON.parse(event.body);
//     const updatedAddress = await userService.updateAddressById(
//       userId,
//       addressId,
//       addInfo
//     );
//     return {
//       statusCode: 200,
//       body: {
//         message: 'updated address.',
//         address: updatedAddress,
//       },
//     };
//   }

//   // payment
//   public async getPaymentInfoByUserId(event) {
//     const userId = event.pathParameters.userId;
//     const payment = await userService.getPaymentInfoByUserId(userId);
//     return { statusCode: 200, body: payment };
//   }

//   public async getPaymentInfoByPaymentId(event) {
//     const { userId, paymentId } = event.pathParameters;
//     const payment = await userService.getPaymentInfoByPaymentId(
//       userId,
//       paymentId
//     );
//     return { statusCode: 200, body: payment };
//   }

//   public async addPaymentByUserId(event) {
//     const userId = event.pathParameters.userId;
//     const paymentInfo = JSON.parse(event.body);
//     const paymentId = await userService.addPaymentByUserId(userId, paymentInfo);
//     return { statusCode: 200, body: paymentId };
//   }

//   public async deletePaymentById(event) {
//     const { userId, paymentId } = event.pathParameters;
//     await userService.deletePaymentById(userId, paymentId);
//     return { statusCode: 200, body: { message: 'deleted payment' } };
//   }

//   public async updatePaymentById(event) {
//     const { userId, paymentId } = event.pathParameters;
//     const paymentInfo = JSON.parse(event.body);
//     await userService.updatePaymentById(paymentId, paymentInfo);
//     return { statusCode: 200, body: { message: 'updated address' } };
//   }
// }

///
