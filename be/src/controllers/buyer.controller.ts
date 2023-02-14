import e, { Request, Response } from 'express'
import {
  createBuyer,
  findAllBuyers,
  findBuyerById,
  findPaymentByBuyerId,
  createPayment,
  editPaymentById,
  deletePaymentByUId,
  deletePayment,
} from '../models/Buyer.model'
import { Payment_method } from '../utils/types'

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

export const getBuyerById = async (req: Request, res: Response) => {
  const rst = await findBuyerById(req.params['id'].slice(1))

  return res.json(rst)
}

export const getPaymentByBuyerId = async (req: Request, res: Response) => {
  // const rst = await findPaymentByBuyerId(
  //   req.params['user_id'].slice(1),
  //   req.params['id'].slice(1)
  // )
  const rst = await findPaymentByBuyerId(req.params['user_id'].slice(1))
  return res.json(rst)
}

export const addPayment = async (req: Request, res: Response) => {
  const newPayment: Payment_method = req.body
  const payment = await createPayment(req.params['id'].slice(1), newPayment)
  res.send(payment)
}

export const updatePaymentByUserId = async (req: Request, res: Response) => {
  const addInfo: Payment_method = req.body
  const rst = await editPaymentById(req.params['id'].slice(1), addInfo)
  return res.json(rst)
}

export const deletePaymentByUserId = async (req: Request, res: Response) => {
  const rst = await deletePaymentByUId(req.params['id'].slice(1))
  return res.json(rst)
}

export const deletePaymentById = async (req: Request, res: Response) => {
  const rst = await deletePayment(req.params['id'].slice(1))
  return res.json(rst)
}
