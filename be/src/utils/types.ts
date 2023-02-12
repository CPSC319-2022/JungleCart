export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  created_at?: Date;
  update_at?: Date;
}

export type Address = {
  id: number
  user_id: number
  address_line_1: string
  address_line_2?: string
  city: string
  province: string
  postal_code: string
  recipient: string
  telephone: string
}

export type Buyer = {
  id: number
  pref_address_id: number
  pref_pm_id: number
}

export type Payment = {
  id: number
  is_paypal: boolean
  paypal_id?: string
  is_credit: boolean
  bank_name?: string
  card_num?: number
  expirarion_date?: string
  name_on_card?: string
}

export type Seller = {
  id: number
  bank_name: string
  account_num: number
}

export type Order = {
  id: number
  buyer_id: number
  price: number
  status: string
  date: string
}

export type Shipping_status = {
  id: number
  status: string
  expected_delivery_date: string
}

export type Order_item = {
  order_id: number
  product_id: number
  shippings: number
  quantity: number
}

export type Product = {
  id: number
  seller_id: number
  name: string
  price: number
  tag: string
  promoting: boolean
  discription: string
  remaing_quantity: number
  address: string
  status: string
  created_at: string
  shipping_cost: number
  expected_delivery_date: string
}

export type Shipping_constraint = {
  product_id: number
  region: string
  distance: string
}

export type Product_multimedia = {
  id: number
  url: string
  product_id: number
}

export type Cart = {
  id: number
  buyer_id: number
  total_item_price: number
  shipping_cost: number
}

export type Cart_item = {
  cart_id: number
  product_id: number
  quantity: number
  price: number
  shipping: number
}
