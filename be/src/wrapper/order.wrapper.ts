import { Order_combo } from '../utils/returnMapper';
import e, { Request, Response } from 'express';
// import { OrderModel } from '../models'
import { Order_item } from '../utils/types';

export const orderInfoMap = async (wrap: Order_combo[]) => {
  const oi = wrap.map((e) => {
    return {
      product_id: e.product_id,
      shippings: e.shippings,
      quantity: e.quantity,
    };
  });
  return {
    order: {
      id: wrap[0]['id'],
      buyer_id: wrap[0]['buyer_id'],
      status: wrap[0]['status'],
      order_items: oi,
      created_at: wrap[0]['created_at'],
    },
  };
};
