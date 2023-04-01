import { ResponseContent, Router } from '/opt/core/router';
import UserController from './UserController';
const router = new Router();
export const testFlag = false;
const testPrefix = testFlag ? 'test/' : '';

router.get('/users', UserController.validateUser);
// user
router.put('/users/{userId}', UserController.updateUserInfoById);
router.get('/users/{userId}', UserController.getUserInfoById);

router.get('/users/{userId}/seller', UserController.getSellerInfo);
router.get('/users/{userId}/buyer', UserController.getBuyerInfo);

// address
router.get('/users/{userId}/addresses', UserController.getAddressesByUserId);
router.post('/users/{userId}/addresses', UserController.addAddress);
router.get(
  '/users/{userId}/addresses/{addressId}',
  UserController.getAddressByAddressId
);
router.delete(
  '/users/{userId}/addresses/{addressId}',
  UserController.deleteAddressById
);
router.put(
  '/users/{userId}/addresses/{addressId}',
  UserController.updateAddressById
);

// payment
router.get('/users/{userId}/payments', UserController.getPaymentInfoByUserId);
router.post('/users/{userId}/payments', UserController.addPaymentByUserId);
router.put(
  '/users/{userId}/payments/{paymentId}',
  UserController.addPaymentByUserId
);
router.delete(
  '/users/{userId}/payments/{paymentId}',
  UserController.deletePaymentById
);

// handles routing and sends request
exports.handler = async (event): Promise<ResponseContent> => {
  console.log('<TEST::: USER STACK >');
  console.log('<event ::: ', event);
  console.log('<event body ::: ', event.body);
  const handlerResult = await router.route(event);
  console.log('handlerResult ::: ', handlerResult);
  return handlerResult;
};
