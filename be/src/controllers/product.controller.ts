import e, { Request, Response } from 'express'
import { createProduct, findAllProducts } from '../models/Product.model'

export const listProducts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllProducts()
  return res.json(rst)
}

export const addProduct = async (req: Request, res: Response) => {
  console.log(req)
  const {
    seller_id,
    name,
    price,
    discount,
    description,
    address,
    status,
    shipping_method,
    updated_at,
    total_quantity,
    category_id,
  } = req.body
  const user = createProduct(
    seller_id,
    name,
    price,
    discount,
    description,
    address,
    status,
    shipping_method,
    updated_at,
    total_quantity,
    category_id
  )
  res.send(user)
}
