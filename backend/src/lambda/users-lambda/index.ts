import { ResponseContent, Router } from '/opt/common/router';
import { asyncWrap } from '/opt/common/async-wrap';
import UserController from './UserController';
const router = new Router();

// user
router.put('/users/{userId}', asyncWrap(UserController.updateUserInfoById));
router.get('/users/{userId}', asyncWrap(UserController.getUserInfoById));

router.get('/users/{userId}/seller', asyncWrap(UserController.getSellerInfo));
router.get('/users/{userId}/buyer', asyncWrap(UserController.getBuyerInfo));

// address
router.get(
  '/users/{userId}/addresses',
  asyncWrap(UserController.getAddressesByUserId)
);
router.post('/users/{userId}/addresses', asyncWrap(UserController.addAddress));
router.get(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(UserController.getAddressByAddressId)
);
router.delete(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(UserController.deleteAddressById)
);
router.put(
  '/users/{userId}/addresses/{addressId}',
  asyncWrap(UserController.updateAddressById)
);

// payment
router.get(
  '/users/{userId}/payments',
  asyncWrap(UserController.getPaymentInfoByUserId)
);
router.post(
  '/users/{userId}/payments',
  asyncWrap(UserController.addPaymentByUserId)
);
router.put(
  '/users/{userId}/payments/{paymentId}',
  asyncWrap(UserController.addPaymentByUserId)
);
router.delete(
  '/users/{userId}/payments/{paymentId}',
  asyncWrap(UserController.deletePaymentById)
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
