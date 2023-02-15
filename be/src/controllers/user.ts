import { Request, Response } from 'express'
import * as dto from '../utils/types.dto'
import * as model from '../utils/types'
import { UserService } from './../service'
import dotenv from 'dotenv'
dotenv.config()
import errorGenerator from '../utils/errorGenerator'
import { Address, User } from '../utils/types'

class UserController {
  constructor() {
    //
  }

  public async listUsers(req: Request, res: Response) : Promise<Response> {
    const rst = await UserService.listUsers()
    return res.json(rst)
  }

  public async addUser(req: Request, res: Response) {
    const newUser: User = req.body
    const user = await UserService.addUser(newUser)
    res.send(user)
  }

  public async getUserInfoById(req: Request, res: Response) {
    const id = Number(req.params.id)
    const user = await UserService.getUserInfoById(id)
    res.status(200).json({ user })
  }

  public async updateUserInfoById(req: Request, res: Response) {
    const userInfo: User = req.body
    const rst = await UserService.updateUserInfoById(req.params['id'].slice(1), userInfo)
    return res.json(rst)
  }

  // Address
  public async getAddresses(req: Request, res: Response) {
    const rst = await UserService.getAddresses(req.params['id'].slice(1))
    return res.json(rst)
  }

  public async getAddressesByUserId(req: Request, res: Response) {
    const rst = await UserService.getAddressesByUserId(req.params['id'].slice(1))
    return res.json(rst)
  }

  public async addAddress(req: Request, res: Response) {
    const newAddress: Address = req.body
    const address = await UserService.addAddress(newAddress)
    res.send(address)
  }

  public async deleteAddressById(req: Request, res: Response) {
    const rst = await UserService.deleteAddressById(req.params['id'].slice(1))
    return res.json(rst)
  }

  public async updateAddressById(req: Request, res: Response) {
    const addInfo: Address = req.body
    const rst = await UserService.updateAddressById(req.params['id'].slice(1), addInfo)
    return res.json(rst)
  }

}

export default new UserController()
