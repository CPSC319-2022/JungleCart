import * as dto from '../utils/types.dto';
import { Address, User } from '../utils/types.entity';
import { UserService } from './../services';
import dotenv from 'dotenv';

dotenv.config();

class UserController {
  constructor() {
    //
  }

  public async listUsers(event): Promise<res> {
    const users = await UserService.listUsers();
    return { statusCode: 200, body: users };
  }

  public async addUser(event) {
    const newUser: User = event.body;
    const user = await UserService.addUser(newUser);
    return { statusCode: 200, body: user };
  }

  public async getUserInfoById(event) {
    const userId = Number(event.params.userId);
    const user = await UserService.getUserInfoById(userId);
    return { statusCode: 200, body: user };
  }

  public async getBuyerInfo(event) {
    const userId = Number(event.params.userId);
    const buyer: dto.User = await UserService.getBuyerInfo(userId);
    console.log('buyer : ', buyer);
    return { statusCode: 200, body: buyer };
  }

  public async getSellerInfo(event) {
    const userId = Number(event.params.userId);
    const seller: dto.User = await UserService.getSellerInfo(userId);
    return { statusCode: 200, body: seller };
  }

  public async updateUserInfoById(event) {
    const userInfo: User = event.body;
    const userId = Number(event.params.userId);
    await UserService.updateUserInfoById(userId, userInfo);
    return {
      statusCode: 200,
      body: { message: 'updated user info' },
    };
  }
  // Address
  public async getAddresses(event) {
    const userId = event.params.userId;
    const addresses = await UserService.getAddresses(userId);
    return { statusCode: 200, body: addresses };
  }

  public async getAddressesByUserId(event) {
    const userId = event.params.userId;
    const address = await UserService.getAddressesByUserId(userId);
    return { statusCode: 200, body: address };
  }

  public async addAddress(event) {
    const newAddress: Address = event.body;
    const addressId = await UserService.addAddress(newAddress);
    return { statusCode: 200, body: addressId };
  }

  public async deleteAddressById(event) {
    const { userId, addressId } = event.params;
    await UserService.deleteAddressById(userId, addressId);
    return { statusCode: 200, body: { message: 'deleted address' } };
  }

  public async updateAddressById(event) {
    const { userId, addAddressId } = event.params;
    const addInfo: Address = event.body;
    await UserService.updateAddressById(addAddressId, addInfo);
    return { statusCode: 200, body: { message: 'updated address' } };
  }
}

export default new UserController();
