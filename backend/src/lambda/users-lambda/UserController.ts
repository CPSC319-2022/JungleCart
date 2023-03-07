/* eslint-disable @typescript-eslint/no-var-requires */
require('console');
type res = { statusCode: number; body: object | string };
const { UserService } = require('./UserService');
const userService = new UserService();

class UserController {
  constructor() {
    //
  }
  public async listUsers(event) {
    const users = await userService.listUsers();
    return { statusCode: 200, body: users };
  }

  public async addTempUser(event) {
    const newUser = JSON.parse(event.body);
    const user = await userService.addTempUser(newUser);
    return { statusCode: 200, body: user };
  }

  // user
  public async addUser(event) {
    const newUser = JSON.parse(event.body);
    const user = await userService.addUser(newUser);
    return { statusCode: 200, body: user };
  }

  public async getUserInfoById(event) {
    const userId = event.pathParameters.userId;
    const user = await userService.getUserInfoById(userId);
    return { statusCode: 200, body: user };
  }

  public async updateUserInfoById(event) {
    const userInfo = JSON.parse(event.body);
    const userId = Number(event.pathParameters.userId);
    const updatedUserInfo = await userService.updateUserInfoById(
      userId,
      userInfo
    );
    return {
      statusCode: 200,
      body: {
        message: 'updated user info',
        address: updatedUserInfo,
      },
    };
  }

  public async getBuyerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const buyer = await userService.getBuyerInfo(userId);
    return { statusCode: 200, body: buyer };
  }

  public async getSellerInfo(event) {
    const userId = Number(event.pathParameters.userId);
    const seller = await userService.getSellerInfo(userId);
    return { statusCode: 200, body: seller };
  }

  // Address
  public async getAddresses(event) {
    const userId = event.pathParameters.userId;
    const addresses = await userService.getAddresses(userId);
    return { statusCode: 200, body: addresses };
  }

  public async getAddressesByUserId(event) {
    const userId = event.pathParameters.userId;
    const addresses = await userService.getAddressesByUserId(userId);
    return { statusCode: 200, body: addresses };
  }

  public async getAddressByAddressId(event) {
    const { userId, addressId } = event.pathParameters;
    const address = await userService.getAddressByAddressId(userId, addressId);
    return { statusCode: 200, body: address };
  }

  public async addAddress(event) {
    const { userId } = event.pathParameters;
    const addressReq = JSON.parse(event.body);
    const newAddress = await userService.addAddress(userId, addressReq);
    return {
      statusCode: 200,
      body: {
        message: 'created address.',
        address: newAddress,
      },
    };
  }

  public async deleteAddressById(event) {
    const { userId, addressId } = event.pathParameters;
    await userService.deleteAddressById(userId, addressId);
    return { statusCode: 200, body: { message: 'deleted address' } };
  }

  public async updateAddressById(event) {
    const { userId, addressId } = event.pathParameters;
    const addInfo = JSON.parse(event.body);
    const updatedAddress = await userService.updateAddressById(
      userId,
      addressId,
      addInfo
    );
    return {
      statusCode: 200,
      body: {
        message: 'updated address.',
        address: updatedAddress,
      },
    };
  }

  // payment
  public async getPaymentInfoByUserId(event) {
    const userId = event.pathParameters.userId;
    const payment = await userService.getPaymentInfoByUserId(userId);
    return { statusCode: 200, body: payment };
  }

  public async getPaymentInfoByPaymentId(event) {
    const { userId, paymentId } = event.pathParameters;
    const payment = await userService.getPaymentInfoByPaymentId(
      userId,
      paymentId
    );
    return { statusCode: 200, body: payment };
  }

  public async addPaymentByUserId(event) {
    const userId = event.pathParameters.userId;
    const paymentInfo = JSON.parse(event.body);
    const paymentId = await userService.addPaymentByUserId(userId, paymentInfo);
    return { statusCode: 200, body: paymentId };
  }

  public async deletePaymentById(event) {
    const { userId, paymentId } = event.pathParameters;
    await userService.deletePaymentById(userId, paymentId);
    return { statusCode: 200, body: { message: 'deleted payment' } };
  }

  public async updatePaymentById(event) {
    const { userId, paymentId } = event.pathParameters;
    const paymentInfo = JSON.parse(event.body);
    await userService.updatePaymentById(paymentId, paymentInfo);
    return { statusCode: 200, body: { message: 'updated payment' } };
  }
}

module.exports = { UserController };
