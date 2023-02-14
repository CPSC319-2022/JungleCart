import e, { Request, Response } from 'express'
import {
  createSeller,
  findAllSellers,
  findSellerById,
} from '../models/Seller.model'

export const listSellers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllSellers()
  return res.json(rst)
}

export const addSeller = async (req: Request, res: Response) => {
  console.log(req)
  const { id, banking_name, account_num } = req.body
  const user = createSeller(id, banking_name, account_num)
  res.send(user)
}

export const getSellerById = async (req: Request, res: Response) => {
  const rst = await findSellerById(req.params['id'].slice(1))

  return res.json(rst)
}
