import { db } from '../utils/db.server'
import * as types from '../utils/types'

// export const listProducts = async (): Promise<types.Product[]> => {
//   return db.product.findMany({
//     select: {
//       id: true,
//       seller_id: true,
//       name: true,
//       price: true,
//       discount: true,
//       description: true,
//       address: true,
//       status: true,
//       shipping_method: true,
//       created_at: true,
//       updated_at: true,
//       total_quantity: true,
//       category_id: true,
//     },
//   })
// }

export const listMultimedias = async (): Promise<
  types.Product_multimedia[]
> => {
  return db.product_multimedia.findMany({
    select: {
      id: true,
      url: true,
      product_id: true,
    },
  })
}

export const listCategories = async (): Promise<types.Category[]> => {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export const listShippingConstraints = async (): Promise<
  types.Shipping_constraint[]
> => {
  return db.shipping_constraint.findMany({
    select: {
      product_id: true,
      region: true,
      distance: true,
    },
  })
}
