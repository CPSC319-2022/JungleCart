import {Request, Response} from 'express';
import * as dto from '../utils/types.dto';
import {Address, User} from '../utils/types';
import {UserService} from './../service';
import dotenv from 'dotenv';

dotenv.config()

class UserController {
  constructor() {
    //
  }

  public async listUsers(req: Request, res: Response): Promise<Response> {
    const rst = await UserService.listUsers()
    return res.json(rst)
  }

  public async addUser(req: Request, res: Response) {
    const newUser: User = req.body
    const user = await UserService.addUser(newUser)
    res.send(user)
  }

  public async getUserInfoById(req: Request, res: Response) {
    const userId = Number(req.params.userId)
    const user = await UserService.getUserInfoById(userId)
    res.status(200).json({ user })
  }

  public async getBuyerInfo(req: Request, res: Response) {
    const userId = Number(req.params.userId)
    const buyer: dto.User = await UserService.getBuyerInfo(userId)
    console.log('buyer : ', buyer)
    res.status(200).json({ buyer })
  }

  public async getSellerInfo(req: Request, res: Response) {
    const userId = Number(req.params.userId)
    const seller: dto.User = await UserService.getSellerInfo(userId)
    res.status(200).json({ seller })
  }

  public async updateUserInfoById(req: Request, res: Response) {
    const userInfo: User = req.body
    const userId = Number(req.params.userId)
    const rst = await UserService.updateUserInfoById(userId, userInfo)
    return res.json(rst)
  }

  // Address
  public async getAddresses(req: Request, res: Response) {
    const userId = req.params.userId
    const rst = await UserService.getAddresses(userId)
    return res.json(rst)
  }

  public async getAddressesByUserId(req: Request, res: Response) {
    const userId = req.params.userId
    const rst = await UserService.getAddressesByUserId(userId)
    return res.json(rst)
  }

  public async addAddress(req: Request, res: Response) {
    const newAddress: Address = req.body
    const address = await UserService.addAddress(newAddress)
    res.send(address)
  }

  public async deleteAddressById(req: Request, res: Response) {
    const { userId, addAddressId } = req.params
    const rst = await UserService.deleteAddressById(req.params['id'].slice(1))
    return res.json(rst)
  }

  public async updateAddressById(req: Request, res: Response) {
    const { userId, addAddressId } = req.params
    const addInfo: Address = req.body
    const rst = await UserService.updateAddressById(addAddressId, addInfo)
    return res.json(rst)
  }
}

export default new UserController()
