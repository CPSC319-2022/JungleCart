import { db } from '../utils/db.server'
import * as types from '../utils/types'

export const listBuyers = async (): Promise<types.Cart_item[]> => {
  return db.cart_item.findMany({
    select: {
      buyer_id: true,
      product_id: true,
      quantity: true,
    },
  })
}
