/* eslint-disable @typescript-eslint/no-var-requires */
import { Cart_item } from '../../utils/types';
import CartService from './service';
import NetworkError from '/opt/common/network-error';
import { Request, Response, Result } from '/opt/common/router';

export async function getCartItems(Request, Response) {
  const cart = await CartService.getCartItems(Request.params.userId);
  const rst = { cart: [cart] };
  return Response.status(200).send(rst);
}

export async function addCartItem(Request, Response) {
  const bid = Request.params.userId;
  const pbody = JSON.parse(Request.body);
  const count = await itemCount(bid, pbody.id);
  const info: Cart_item = {
    buyer_id: bid,
    product_id: pbody.id,
    quantity: (pbody.quantity ?? 0) + (count ?? 0),
  };
  console.log('info, count, quantity', info, count, pbody.quantity);
  const cart =
    count !== 0
      ? await CartService.updateQuantity(info)
      : await CartService.addCartItem(info);
  return Response.status(201).send({ cart: cart });
}

export async function updateCartItems(Request, Response) {
  const bid = Request.params.userId;
  const pbody = JSON.parse(Request.body).cart_items;
  const info = pbody.map((e) => `(${bid}, ${e.id}, ${e.quantity})`).join(', ');
  console.log('info in controller ::: ', info);
  const rst = await CartService.updateCartItems(bid, info);
  return Response.status(200).send(rst);
}

export async function deleteCartItem(Request, Response) {
  const bid = Request.params.userId;
  const pid = Request.params.id;
  const rst = await CartService.deleteCartItem(bid, pid);
  return Response.status(200).send(rst);
}

export async function itemCount(bid, pid) {
  return await CartService.itemCount(bid, pid);
}
