export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  department: string
  created_at: Date
}

export type Address = {
  id: number
  user_id: number
  address_line_1: string
  address_line_2: string | null
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

export type Payment_method = {
  id: number
  is_paypal: boolean
  paypal_id: string | null
  is_credit: boolean | null
  bank_name: string | null
  card_num: string | null
  expiration_date: string | null
  first_name: string | null
  last_name: string | null
}

export type Seller = {
  id: number
  banking_name: string
  account_num: string
}

export type Order = {
  id: number
  buyer_id: number
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
  discount: number | null
  description: string | null
  address: string
  status: string
  shipping_method: string
  created_at: Date
  updated_at: Date
  total_quantity: number
  category_id: number
}

export type Shipping_constraint = {
  product_id: number
  region: string | null
  distance: number | null
}

type Category = {
  id: number
  name: string
}

export type Product_multimedia = {
  id: number
  url: string
  product_id: number
}

type Cart_item = {
  buyer_id: number
  product_id: number
  quantity: number
}

type Admin = {
  id: number
  email: string
  first_name: string
  last_name: string
  department: string
  role: string
}
