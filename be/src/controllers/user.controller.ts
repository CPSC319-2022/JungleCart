import e, { Request, Response } from 'express'
import { createUser, findAllUsers } from '../models/User.model'

export const listUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllUsers()
  return res.json(rst)
}

export const addUsers = async (req: Request, res: Response) => {
  console.log(req)
  const { first_name, last_name, email, department } = req.body
  const user = createUser(first_name, last_name, email, department)
  res.send(user)
}
