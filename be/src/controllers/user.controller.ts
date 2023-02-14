import { Request, Response } from 'express'
import {
  createUser,
  findAllUsers,
  findUserById,
  findAddressByUserId,
  createAddress,
  editUserInfo,
  editAddressById,
  deleteAddress,
} from '../models/User.model'
import { Address, User } from '../utils/types'

export const listUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const rst = await findAllUsers()
  return res.json(rst)
}

export const addUser = async (req: Request, res: Response) => {
  const newUser: User = req.body
  const user = await createUser(newUser)
  res.send(user)
}

export const getUserById = async (req: Request, res: Response) => {
  const rst = await findUserById(req.params['id'].slice(1))
  return res.json(rst)
}

export const updateUser = async (req: Request, res: Response) => {
  const userInfo: User = req.body
  const rst = await editUserInfo(req.params['id'].slice(1), userInfo)
  return res.json(rst)
}

//Address
export const addAddress = async (req: Request, res: Response) => {
  const newAddress: Address = req.body
  const address = await createAddress(newAddress)
  res.send(address)
}

export const getAddressesByUserId = async (req: Request, res: Response) => {
  const rst = await findAddressByUserId(req.params['id'].slice(1))
  return res.json(rst)
}

export const updateAddressById = async (req: Request, res: Response) => {
  const addInfo: Address = req.body
  const rst = await editAddressById(req.params['id'].slice(1), addInfo)
  return res.json(rst)
}

export const deleteAddressById = async (req: Request, res: Response) => {
  const rst = await deleteAddress(req.params['id'].slice(1))
  return res.json(rst)
}
