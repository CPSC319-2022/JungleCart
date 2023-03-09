/* eslint-disable @typescript-eslint/no-var-requires */
import { Cart_item } from '../../utils/types';
import CartService from './carts-service';

export async function getCartItems(e) {
  const cart = await CartService.getCartItems(e.pathParameters.userId);
  return { cart: [cart] };
}

export async function addCartItem(e) {
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
  const bid = e.pathParameters.userId;
  const pbody = JSON.parse(e.body).cart_items;
  const info = pbody.map((e) => `(${bid}, ${e.id}, ${e.quantity})`).join(', ');
  return await CartService.updateCartItems(bid, info);
}

export async function deleteCartItem(e) {
  const bid = e.pathParameters.userId;
  const pid = e.pathParameters.id;
  return await CartService.deleteCartItem(bid, pid);
}
