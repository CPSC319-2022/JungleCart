import { ResponseContent, Router } from '/opt/common/router';
import { Request, Response, Result } from '/opt/common/router';
import { asyncWrap } from '/opt/common/async-wrap';
import UserController from './UserController';
const router = new Router();
export const testFlag = false;
const testPrefix = testFlag ? 'test/' : '';

// user
router.put(
  `/${testPrefix}users/{userId}`,
  asyncWrap(UserController.updateUserInfoById)
);
router.get(
  `/${testPrefix}users/{userId}`,
  asyncWrap(UserController.getUserInfoById)
);

router.get(
  `/${testPrefix}users/{userId}/seller`,
  asyncWrap(UserController.getSellerInfo)
);
router.get(
  `/${testPrefix}users/{userId}/buyer`,
  asyncWrap(UserController.getBuyerInfo)
);

// address
router.get(
  `/${testPrefix}users/{userId}/addresses`,
  asyncWrap(UserController.getAddressesByUserId)
);
router.post(
  `/${testPrefix}users/{userId}/addresses`,
  asyncWrap(UserController.addAddress)
);
router.get(
  `/${testPrefix}users/{userId}/addresses/{addressId}`,
  asyncWrap(UserController.getAddressByAddressId)
);
router.delete(
  `/${testPrefix}users/{userId}/addresses/{addressId}`,
  asyncWrap(UserController.deleteAddressById)
);
router.put(
  `/${testPrefix}users/{userId}/addresses/{addressId}`,
  asyncWrap(UserController.updateAddressById)
);

// payment
router.get(
  `/${testPrefix}users/{userId}/payments`,
  asyncWrap(UserController.getPaymentInfoByUserId)
);
router.post(
  `/${testPrefix}users/{userId}/payments`,
  asyncWrap(UserController.addPaymentByUserId)
);
router.put(
  `/${testPrefix}users/{userId}/payments/{paymentId}`,
  asyncWrap(UserController.addPaymentByUserId)
);
router.delete(
  `/${testPrefix}users/{userId}/payments/{paymentId}`,
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
