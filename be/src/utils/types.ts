export {
  User,
  Address,
  Buyer,
  Payment_method,
  Seller,
  Order,
  Product,
  Shipping_status,
  Order_item,
  Cart_item,
  Shipping_constraint,
  Product_multimedia,
  Category,
  Admin,
}

type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  department: string
  created_at: Date
}

type Address = {
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

type Buyer = {
  id: number
  pref_address_id: number
  pref_pm_id: number
}

type Payment_method = {
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

type Seller = {
  id: number
  banking_name: string
  account_num: string
}

type Order = {
  id: number
  buyer_id: number
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

type Shipping_constraint = {
  product_id: number
  region: string | null
  distance: number | null
}

type Category = {
  id: number
  name: string
}

type Product_multimedia = {
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
