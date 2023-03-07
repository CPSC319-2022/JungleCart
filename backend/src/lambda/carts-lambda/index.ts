/* eslint-disable @typescript-eslint/no-var-requires */
const { Router, BadRequest } = require('/opt/nodejs/node_modules/sql-layer');
const {
  getCartItems,
  addCartItem,
  updateCartItems,
  deleteCartItem,
} = require('/opt/nodejs/node_modules/carts-layer');
const router = new Router();

exports.handler = async (e) => {
  const handlerResult = await router.route(e);
  console.log('handlerResult :: ', handlerResult);
  return handlerResult;
};

router.put('/carts/{userId}/items', handling(updateCartItemsL));
router.delete('/carts/{userId}/items/{id}', handling(deleteCartItemL));
router.get('/carts/{userId}/items', handling(getCartItemsL));
router.post('/carts/{userId}/items', handling(addCartItemL));

// util
function handling(handler) {
  return async (event) => {
    try {
      const result = await handler(event);
      return {
        statusCode: result.statusCode || 200,
        body: JSON.stringify(result),
      };
    } catch (err) {
      return { statusCode: err.statusCode, body: err.message };
    }
  };
}

async function getCartItemsL(e) {
  await requestValidation(e);
  return await getCartItems(e);
}

async function addCartItemL(e): Promise<response> {
  await requestValidation(e);
  return await addCartItem(e);
}

async function updateCartItemsL(e): Promise<response> {
  await requestValidation(e);
  return await updateCartItems(e);
}

async function deleteCartItemL(e): Promise<response> {
  await requestValidation(e);
  return await deleteCartItem(e);
}

async function requestValidation(e) {
  if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
    if (!e.pathParameters.userId || !e.body)
      return new BadRequest('no user id');
  } else {
    if (!e.pathParameters.userId) return new BadRequest('no user id');
  }
}

type response = { statusCode: number; body: object | string };
