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

/// model
const db = 'sqlDB';
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

  private async sendQuery(sql: string, set?) {
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

  public async sendQuery1(sql: string, set?) {
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

  public async updateUserInfoById(id, info) {
    return await userModel.updateUserInfoById(id, info);
  }

  public async getUserInfoById(id: number) {
    //this.checkUserIdExist(id);
    return await userModel.getUserInfoById(id);
  }

  public async getBuyerInfo(id) {
    this.checkUserIdExist(id);
    return await userModel.getBuyerInfo(id);
  }

  public async getSellerInfo(id) {
    return await userModel.getSellerInfo(id);
  }

  public async listUsers() {
    return await userModel.listUsers();
  }

  public async addUser(info) {
    return await userModel.addUser(info);
  }

  public async getAddresses(id) {
    return await userModel.getAddresses(id);
  }

  public async getAddressesByUserId(id) {
    return await userModel.getAddressesByUserId(id);
  }

  public async deleteAddressById(userId, addressId) {
    return await userModel.deleteAddressById(userId, addressId);
  }

  public async updateAddressById(id, info) {
    return await userModel.updateAddressById(id, info);
  }
  public async addAddress(info) {
    return await userModel.addAddress(info);
  }

  public async checkUserIdExist(id: number) {
    const result = await userModel.checkUserIdExist(id);
    if (!result) {
      errorGenerator({
        message: 'INVALID REQUEST: user id not exist',
        statusCode: 422,
      });
    }
  }

  public isEmpty(obj: Record<string, unknown>) {
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

  public async listUsers(event): Promise<response> {
    const users = await userService.listUsers();
    return { statusCode: 200, body: users };
  }

  public async addUser(event) {
    const newUser = event.body;
    const user = await userService.addUser(newUser);
    return { statusCode: 200, body: user };
  }

  public async getUserInfoById(event): Promise<response> {
    const userId = event.pathParameters.userId;
    console.error('debug ::: userID = ', userId);
    const user = await userService.getUserInfoById(Number(userId));
    return { statusCode: 200, body: user };
  }

  public async getBuyerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const buyer = await userService.getBuyerInfo(userId);
    console.log('buyer : ', buyer);
    return { statusCode: 200, body: buyer };
  }

  public async getSellerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const seller = await userService.getSellerInfo(userId);
    return { statusCode: 200, body: seller };
  }

  public async updateUserInfoById(event) {
    const userInfo = event.body;
    const userId = Number(event.pathParameters.userId);
    await userService.updateUserInfoById(userId, userInfo);
    return {
      statusCode: 200,
      body: { message: 'updated user info' },
    };
  }
  // Address
  public async getAddresses(event) {
    const userId = event.pathParameters.userId;
    const addresses = await userService.getAddresses(userId);
    return { statusCode: 200, body: addresses };
  }

  public async getAddressesByUserId(event) {
    const userId = event.pathParameters.userId;
    const address = await userService.getAddressesByUserId(userId);
    return { statusCode: 200, body: address };
  }

  public async addAddress(event) {
    const newAddress = event.body;
    const addressId = await userService.addAddress(newAddress);
    return { statusCode: 200, body: addressId };
  }

  public async deleteAddressById(event) {
    const { userId, addressId } = event.pathParameters;
    await userService.deleteAddressById(userId, addressId);
    return { statusCode: 200, body: { message: 'deleted address' } };
  }

  public async updateAddressById(event) {
    const { userId, addAddressId } = event.pathParameters;
    const addInfo = event.body;
    await userService.updateAddressById(addAddressId, addInfo);
    return { statusCode: 200, body: { message: 'updated address' } };
  }
}

///

// asyncwrap //

function asyncWrap(handler) {
  return async (event) => {
    try {
      const result = await handler(event);
      return {
        statusCode: result.statusCode,
        body: JSON.stringify(result.body),
      };
    } catch (err) {
      const error = err as ICustomError;
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          message: error.message || 'Internal Server Error',
        }),
      };
    }
  };
}

//

const router = new Router();
const userController = new UserController();
//// router

router.get('/users', asyncWrap(userController.listUsers));
router.post('/users/', asyncWrap(userController.addUser));

router.put('/users/{userId}', asyncWrap(userController.updateUserInfoById));
router.get('/users/{userId}', asyncWrap(userController.getUserInfoById));

router.get('/users/{userId}/addresses', asyncWrap(userController.getAddresses));
router.post('/users/{userId}/addresses', asyncWrap(userController.addAddress));

router.get(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(userController.getAddressesByUserId)
);
router.delete(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(userController.deleteAddressById)
);
router.put(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(userController.updateAddressById)
);

router.get('/users/{userId}/seller', asyncWrap(userController.getSellerInfo));
router.get('/users/{userId}/buyer', asyncWrap(userController.getBuyerInfo));

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
  process.env.RDS_PORT,
  process.env.RDS_DB
);

// handles routing and sends request
exports.handler = async function (event) {
  console.log('<TEST::: USER STACK >');
  console.log('::: event ::: ', event);
  return await router.route(event);
};

// handles routing and sends request
//exports.handler = asyncWrap(async function (event) {
//  return await router.route(event);
//});
