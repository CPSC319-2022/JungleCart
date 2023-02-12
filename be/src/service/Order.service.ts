import { db } from '../utils/db.server'
import * as types from '../utils/types'

export const listOrders = async (): Promise<types.Order[]> => {
  return db.order.findMany({
    select: {
      id: true,
      buyer_id: true,
      status: true,
      date: true,
    },
  })
}

export const listOrderItems = async (): Promise<types.Order_item[]> => {
  return db.order_item.findMany({
    select: {
      order_id: true,
      product_id: true,
      shippings: true,
      quantity: true,
    },
  })
}

export const listShippingStatus = async (): Promise<
  types.Shipping_status[]
> => {
  return db.shipping_status.findMany({
    select: {
      id: true,
      status: true,
      expected_delivery_date: true,
    },
  })
}
