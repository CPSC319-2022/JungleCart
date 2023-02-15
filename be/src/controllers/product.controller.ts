import e, { Request, Response } from 'express'
import {
  createProduct,
  findAllProducts,
  findProductById,
  deleteProduct,
  editProductById,
} from '../models/Product.model'
import { Product } from '../utils/types'

export const getProductsInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllProducts()
  return res.json(rst)
}

export const addProduct = async (req: Request, res: Response) => {
  console.log(req)
  const prod: Product = req.body
  const user = createProduct(prod)
  res.send(user)
}

export const getProductInfoById = async (req: Request, res: Response) => {
  const rst = await findProductById(req.params['id'].slice(1))
  return res.json(rst)
}

export const deleteProductById = async (req: Request, res: Response) => {
  const rst = await deleteProduct(req.params['id'].slice(1))
  return res.json(rst)
}

export const updateProductInfoById = async (req: Request, res: Response) => {
  const prodInfo: Product = req.body
  const rst = await editProductById(req.params['id'].slice(1), prodInfo)
  return res.json(rst)
}
