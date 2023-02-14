import e, { Request, Response } from 'express'
import { createAdmin, findAllAdmins } from '../models/Admin.model'

export const listAdmins = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllAdmins()
  return res.json(rst)
}

export const addAdmins = async (req: Request, res: Response) => {
  console.log(req)
  const { email, first_name, last_name, department, role } = req.body
  const user = createAdmin(email, first_name, last_name, department, role)
  res.send(user)
}