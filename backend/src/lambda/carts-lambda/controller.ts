/* eslint-disable @typescript-eslint/no-var-requires */
import { Cart_item } from '../../utils/types';
import CartService from './service';
import NetworkError from '/opt/common/network-error';

export async function getCartItems(e) {
  await requestValidation(e);
  const cart = await CartService.getCartItems(e.pathParameters.userId);
  return { cart: [cart] };
}

export async function addCartItem(e) {
  await requestValidation(e);
  const bid = e.pathParameters.userId;
  const pbody = JSON.parse(e.body);
  const info: Cart_item = {
    buyer_id: bid,
    product_id: pbody.id,
    quantity: pbody.quantity,
  };
  const cart = await CartService.addCartItem(info);
  return { cart: cart };
}

export async function updateCartItems(e) {
  await requestValidation(e);
  const bid = e.pathParameters.userId;
  const pbody = JSON.parse(e.body).cart_items;
  const info = pbody.map((e) => `(${bid}, ${e.id}, ${e.quantity})`).join(', ');
  return await CartService.updateCartItems(bid, info);
}

export async function deleteCartItem(e) {
  await requestValidation(e);
  const bid = e.pathParameters.userId;
  const pid = e.pathParameters.id;
  return await CartService.deleteCartItem(bid, pid);
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
