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

router.put('/carts/{userId}/items', handling(updateCartItems));
router.delete('/carts/{userId}/items/{id}', handling(deleteCartItem));
router.get('/carts/{userId}/items', handling(getCartItems));
router.post('/carts/{userId}/items', handling(addCartItem));

// util
function handling(controller) {
  return async (Request, Response) => {
    try {
      const result = await controller(Request, Response);
      return result;
    } catch (err) {
      console.log(err);
      return Response.status(400).send(err);
    }
  };
}

async function requestValidation(e) {
  if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
    if (!e.pathParameters.userId || !e.body)
      throw NetworkError.BAD_REQUEST.msg('no user id');
  } else {
    if (!e.pathParameters.userId)
      throw NetworkError.BAD_REQUEST.msg('no user id');
  }
}
