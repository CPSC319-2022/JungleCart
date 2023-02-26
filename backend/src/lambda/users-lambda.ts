//eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  Router,
  createConnection,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('/opt/nodejs/node_modules/sql-layer');

//import { Router, createConnection } from '../layer/sql-layer/sql-layer';
import { UserController } from '../controllers';
import asyncWrap from './async-wrap';
import databaseLocal from '../../config/databaseLocal';
import dotenv from 'dotenv';

dotenv.config();

const router = new Router();

router.get('/users', asyncWrap(UserController.listUsers));
router.post('/users/', asyncWrap(UserController.addUser));

router.put('/users/{userId}', asyncWrap(UserController.updateUserInfoById));
router.get('/users/{userId}', asyncWrap(UserController.getUserInfoById));

router.get('/users/{userId}/addresses', asyncWrap(UserController.getAddresses));
router.post('/users/{userId}/addresses', asyncWrap(UserController.addAddress));

router.get(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(UserController.getAddressesByUserId)
);
router.delete(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(UserController.deleteAddressById)
);
router.put(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(UserController.updateAddressById)
);

router.get('/users/{userId}/seller', asyncWrap(UserController.getSellerInfo));
router.get('/users/{userId}/buyer', asyncWrap(UserController.getBuyerInfo));

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
// // handles routing and sends request
// exports.handler = asyncWrap(async function (event) {
//   return await router.route(event);
// });
