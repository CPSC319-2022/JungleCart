import { asyncWrap } from '/opt/common/async-wrap';
import NetworkError from '/opt/common/network-error';
import {
  getCartItems,
  addCartItem,
  updateCartItems,
  deleteCartItem,
} from './controller';
import { Router } from '/opt/common/router';
const router: Router = new Router();
exports.handler = async (e) => {
  return await router.route(e);
};

exports.handler = async (e) => {
  const handlerResult = await router.route(e);
  console.log('handlerResult :: ', handlerResult);
  return handlerResult;
};

router.put('/carts/{userId}/items', asyncWrap(updateCartItems));
router.delete('/carts/{userId}/items/{id}', asyncWrap(deleteCartItem));
router.get('/carts/{userId}/items', asyncWrap(getCartItems));
router.post('/carts/{userId}/items', asyncWrap(addCartItem));

// util
// function handling(controller) {
//   return async (Request, Response) => {
//     try {
//       const result = await controller(Request, Response);
//       const statusCode = result.statusCode || 200;
//       return Response.status(statusCode).send(JSON.stringify(result));
//     } catch (err) {
//       console.log(err);
//       return;
//       // return { statusCode: err.statusCode, body: err.message };
//     }
//   };
// }

// export async function getCartItemsL(e) {
//   await requestValidation(e);
//   return await getCartItems(e);
// }

// export async function addCartItemL(e): Promise<response> {
//   await requestValidation(e);
//   return await addCartItem(e);
// }

// export async function updateCartItemsL(e): Promise<response> {
//   await requestValidation(e);
//   return await updateCartItems(e);
// }

// export async function deleteCartItemL(e): Promise<response> {
//   await requestValidation(e);
//   return await deleteCartItem(e);
// }

// async function requestValidation(e) {
//   if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
//     if (!e.pathParameters.userId || !e.body)
//       throw NetworkError.BAD_REQUEST.msg('no user id');
//   } else {
//     if (!e.pathParameters.userId)
//       throw NetworkError.BAD_REQUEST.msg('no user id');
//   }
// }
