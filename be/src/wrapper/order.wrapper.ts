import e, { Request, Response } from 'express'
import {
  createOrder,
  findAllOrders,
  findAllOrderItmes,
  findOrderInfoById,
  deleteOrder,
  findOrderItmesByOrderId,
  findOrderInfoByBuyerId,
} from '../models/Order.model'
import { Order_combo } from '../utils/returnMapper'
import { Order_item } from '../utils/types'

export const orderInfoMap = async (wrap: Order_combo[]) => {
  // const wrap: Order_combo[] = await findOrderInfoById(id)
  const oi = wrap.map((e) => {
    return {
      product_id: e.product_id,
      shippings: e.shippings,
      quantity: e.quantity,
    }
  })
  return {
    order: {
      id: wrap[0]['id'],
      buyer_id: wrap[0]['buyer_id'],
      status: wrap[0]['status'],
      order_items: oi,
      created_at: wrap[0]['created_at'],
    },
  }
}
//   [{
// 	order: {
// 		id: int,
// 		status: string,
// 		products: [
// 			{
// 				id: int,
// 				product_uri: string,
// 				name: string,
// 				price: float,
// 				description: string,
// 				img: string,
// 				quantity: int,
// 				shipping_status: string,
// 			},
// 			{
// 				id: int,
// 				product_uri: string,
// 				name: string,
// 				price: float,
// 				description: string,
// 				img: string,
// 				quantity: int,
// 				shipping_status: string,
// 			},
// 			...
// 		],
// 		created_at: string,
// 	}
// }]
