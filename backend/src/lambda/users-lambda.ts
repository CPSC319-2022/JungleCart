/* eslint-disable @typescript-eslint/no-var-requires */
const {
  Router,
  createConnection,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('/opt/nodejs/node_modules/sql-layer');

const { UserController } = require('/opt/nodejs/node-modules/userController');

//import { Router, createConnection } from '../layer/sql-layer/sql-layer';
import dotenv from 'dotenv';

dotenv.config();

const router = new Router();

router.get('/users', asyncWrap(UserController.listUsers));
// router.post('/users/', asyncWrap(UserController.addUser));

// router.put('/users/{userId}', asyncWrap(UserController.updateUserInfoById));
// router.get('/users/{userId}', asyncWrap(UserController.getUserInfoById));

// router.get('/users/{userId}/addresses', asyncWrap(UserController.getAddresses));
// router.post('/users/{userId}/addresses', asyncWrap(UserController.addAddress));

// router.get(
//   '/users/{userId}/addresses/{addressId}',
//   asyncWrap(UserController.getAddressesByUserId)
// );
// router.delete(
//   '/users/{userId}/addresses/{addressId}',
//   asyncWrap(UserController.deleteAddressById)
// );
// router.put(
//   '/users/{userId}/addresses/{addressId}',
//   asyncWrap(UserController.updateAddressById)
// );

// router.get('/users/{userId}/seller', asyncWrap(UserController.getSellerInfo));
// router.get('/users/{userId}/buyer', asyncWrap(UserController.getBuyerInfo));

// DATABASE CONNECTON : LOCAL
// createConnection(
//   databaseLocal.mysql.host,
//   databaseLocal.mysql.user,
//   databaseLocal.mysql.password,
//   databaseLocal.mysql.port,
//   databaseLocal.mysql.database
// );

// DATABASE CONNECTION : RDS
createConnection(
  process.env.RDS_HOSTNAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  process.env.RDS_PORT
);

// handles routing and sends request
exports.handler = async function (event) {
  return await router.route(event);
};

// handles routing and sends request
//exports.handler = asyncWrap(async function (event) {
//  return await router.route(event);
//});

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

function asyncWrap(handler) {
  return async (event) => {
    try {
      const result = await handler(event);
      return {
        statusCode: result.statusCode,
        body: JSON.stringify(result.body),
      };
    } catch (err) {
      const error = err as CustomError;
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          message: error.message || 'Internal Server Error',
        }),
      };
    }
  };
}
