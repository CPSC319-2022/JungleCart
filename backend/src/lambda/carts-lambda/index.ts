import {
  getCartItems,
  addCartItem,
  updateCartItems,
  deleteCartItem,
} from './controller';
import NetworkError from '/opt/core/NetworkError';
import Router from '/opt/core/Router';
const router: Router = new Router();

exports.handler = async (e) => {
  requestValidation(e);
  return await router.route(e);
};

router.put('/carts/{userId}/items', handling(updateCartItems));
router.delete('/carts/{userId}/items/{id}', handling(deleteCartItem));
router.get('/carts/{userId}/items', handling(getCartItems));
router.post('/carts/{userId}/items', handling(addCartItem));

// util
function handling(controller) {
  return async (Request, Response) => {
    try {
      return await controller(Request, Response);
    } catch (err) {
      const error = err as NetworkError;
      return Response.status(400).send(error.message);
    }
  };
}

async function requestValidation(e) {
  if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
    if (!e.pathParameters.userId || !e.body) {
      throw NetworkError.BAD_REQUEST.msg('no user id');
    }
  } else {
    if (!e.pathParameters.userId) {
      throw NetworkError.BAD_REQUEST.msg('no user id');
    }
  }
}
