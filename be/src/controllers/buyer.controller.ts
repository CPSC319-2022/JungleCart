import e, { Request, Response } from 'express'
import { createBuyer, findAllBuyers } from '../models/Buyer.model'

export const listBuyers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllBuyers()
  return res.json(rst)
}

export const addBuyers = async (req: Request, res: Response) => {
  console.log(req)
  const { id, pref_address_id, pref_pm_id } = req.body
  const user = createBuyer(id, pref_address_id, pref_pm_id)
  res.send(user)
}
