/* eslint-disable @typescript-eslint/no-var-requires */
//const { UserService } = require('/opt/nodejs/node_modules/user-layer');
const { asyncWrap } = require('/opt/nodejs/node_modules/asyncWrap-layer');
const UserService = require('/opt/nodejs/node_modules/user-layer/service');
type res = { statusCode: number; body: object | string };

class UserController {
  constructor() {
    //
  }

  public async listUsers(event): Promise<res> {
    const users = await UserService.listUsers();
    return { statusCode: 200, body: users };
  }

  public async addUser(event) {
    const newUser = event.body;
    const user = await UserService.addUser(newUser);
    return { statusCode: 200, body: user };
  }

  public async getUserInfoById(event) {
    const userId = Number(event.pathParameters.userId);
    const user = await UserService.getUserInfoById(userId);
    return { statusCode: 200, body: user };
  }

  public async getBuyerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const buyer = await UserService.getBuyerInfo(userId);
    console.log('buyer : ', buyer);
    return { statusCode: 200, body: buyer };
  }

  public async getSellerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const seller = await UserService.getSellerInfo(userId);
    return { statusCode: 200, body: seller };
  }

  public async updateUserInfoById(event) {
    const userInfo = event.body;
    const userId = Number(event.pathParameters.userId);
    await UserService.updateUserInfoById(userId, userInfo);
    return {
      statusCode: 200,
      body: { message: 'updated user info' },
    };
  }
  // Address
  public async getAddresses(event) {
    const userId = event.pathParameters.userId;
    const addresses = await UserService.getAddresses(userId);
    return { statusCode: 200, body: addresses };
  }

  public async getAddressesByUserId(event) {
    const userId = event.pathParameters.userId;
    const address = await UserService.getAddressesByUserId(userId);
    return { statusCode: 200, body: address };
  }

  public async addAddress(event) {
    const newAddress = event.body;
    const addressId = await UserService.addAddress(newAddress);
    return { statusCode: 200, body: addressId };
  }

  public async deleteAddressById(event) {
    const { userId, addressId } = event.pathParameters;
    await UserService.deleteAddressById(userId, addressId);
    return { statusCode: 200, body: { message: 'deleted address' } };
  }

  public async updateAddressById(event) {
    const { userId, addAddressId } = event.pathParameters;
    const addInfo = event.body;
    await UserService.updateAddressById(addAddressId, addInfo);
    return { statusCode: 200, body: { message: 'updated address' } };
  }
}

export default new UserController();
