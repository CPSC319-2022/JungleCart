import { asyncWrap } from '/opt/common/async-wrap';
import { UserController } from './UserController';
import { Router } from "/opt/common/router";
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
  asyncWrap(userController.addPaymentByUserId)
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

// handles routing and sends request
exports.handler = async function (event) {
  console.log('<TEST::: USER STACK >');
  console.log('<event ::: ', event);
  console.log('<event body ::: ', event.body);
  const handlerResult = await router.route(event);
  console.log('handlerResult ::: ', handlerResult);
  return handlerResult;
};
