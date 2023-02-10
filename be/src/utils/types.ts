export {
  User,
  Address,
  Buyer,
  Payment,
  Seller,
  Order,
  Shipping_status,
  Order_item,
  Cart,
  Cart_item,
  Shipping_constraint,
  Product_multimedia,
}

type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  gender: string
}

type Address = {
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

type Buyer = {
  id: number
  pref_address_id: number
  pref_pm_id: number
}

type Payment = {
  id: number
  is_paypal: boolean
  paypal_id?: string
  is_credit: boolean
  bank_name?: string
  card_num?: number
  expirarion_date?: string
  name_on_card?: string
}

type Seller = {
  id: number
  bank_name: string
  account_num: number
}

type Order = {
  id: number
  buyer_id: number
  price: number
  status: string
  date: string
}

type Shipping_status = {
  id: number
  status: string
  expected_delivery_date: string
}

type Order_item = {
  order_id: number
  product_id: number
  shippings: number
  quantity: number
}

type Product = {
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

type Shipping_constraint = {
  product_id: number
  region: string
  distance: string
}

type Product_multimedia = {
  id: number
  url: string
  product_id: number
}

type Cart = {
  id: number
  buyer_id: number
  total_item_price: number
  shipping_cost: number
}

type Cart_item = {
  cart_id: number
  product_id: number
  quantity: number
  price: number
  shipping: number
}
