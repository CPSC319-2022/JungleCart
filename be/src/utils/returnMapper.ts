import { Order_item } from './types'
export { Order_combo }

type Order_combo = {
  order_id: number
  product_id: number
  shippings: number
  quantity: number
  status: string
}
