import e, { Request, Response } from 'express'
import { createCartItem, findAllCartItems } from '../models/Cart.model'

export const listCarts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllCartItems()
  return res.json(rst)
}

export const addCarts = async (req: Request, res: Response) => {
  console.log(req)
  const { buyer_id, product_id, quantity } = req.body
  const user = createCartItem(buyer_id, product_id, quantity)
  res.send(user)
}
