export interface User {
  id?: number
  first_name?: string
  last_name?: string
  email?: string
  department?: string
}

export type image_url = string

export interface Product {
  id?: number
  seller_id?: number
  name?: string
  price?: number
  discount?: number // %
  description?: string
  total_quantity?: number
  status?: string // preset (outstock, instock)
  address?: string
  shipping_constraint?: {
    region?: string
    distance?: number // float (km based)
  }
  img?: image_url
  category_id?: number
}
