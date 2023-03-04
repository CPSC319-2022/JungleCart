/* eslint-disable @typescript-eslint/no-var-requires */
//const { UserModel } = require('/opt/nodejs/node_modules/user-layer');
//const UserModel = require('/opt/nodejs/node_modules/user-layer/model');
import dotenv from 'dotenv';
import UserModel from './model';
const {
  errorGenerator,
} = require('/opt/nodejs/node_modules/customError-layer');
const { IUpdateUserDto, IUpdateAddressDto } = require('./user-dto');

dotenv.config();

class UserService {
  //  private userModel: UserModel;
  constructor() {
    //this.userModel = new UserModel();
  }
  // admin
  public async listUsers() {
    return await UserModel.listUsers();
  }

  public async addTempUser(newUser) {
    return await UserModel.addTempUser(newUser);
  }

  // user
  public async addUser(info) {
    return await UserModel.addUser(info);
  }

  public async updateUserInfoById(userId, userInfo) {
    await this.checkIdExist(userId, 'user');
    await this.validUpdateUserDto(userInfo);
    return await UserModel.updateUserInfoById(userId, userInfo);
  }

  public async getUserInfoById(userId: number) {
    await this.checkIdExist(userId, 'user');
    return await UserModel.getUserInfoById(userId);
  }

  public async getBuyerInfo(buyerId) {
    await this.checkIdExist(buyerId, 'buyer');
    return await UserModel.getBuyerInfo(buyerId);
  }

  public async getSellerInfo(sellerId) {
    await this.checkIdExist(sellerId, 'seller');
    return await UserModel.getSellerInfo(sellerId);
  }

  // address

  public async getAddresses(id) {
    await this.checkIdExist(id, 'address ');
    return await UserModel.getAddresses(id);
  }

  public async getAddressesByUserId(userId) {
    await this.checkIdExist(userId, 'user');
    return await UserModel.getAddressesByUserId(userId);
  }

  public async getAddressByAddressId(userId, addressId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    return await UserModel.getAddressByAddressId(userId, addressId);
  }

  public async deleteAddressById(userId, addressId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    return await UserModel.deleteAddressById(userId, addressId);
  }

  public async updateAddressById(userId, addressId, addressInfo) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    const newAddress: typeof IUpdateAddressDto =
      this.validUpdateAddressDto(addressInfo);
    return await UserModel.updateAddressById(userId, addressId, newAddress);
  }

  public async addAddress(userId, addressInfo) {
    this.checkIdExist(userId, 'user');
    const newAddress: typeof IUpdateAddressDto =
      this.validUpdateAddressDto(addressInfo);
    return await UserModel.addAddress(userId, newAddress);
  }

  private validUpdateUserDto(userInfo) {
    // TODO
    if (this.isEmpty(userInfo)) {
      errorGenerator({
        statusCode: 400,
        message: 'Invalid Request. check req body ' + userInfo,
      });
    }
    return;
  }

  private validUpdateAddressDto(addressInfo) {
    if (this.isEmpty(addressInfo) || this.isEmpty(addressInfo['address'])) {
      errorGenerator({
        statusCode: 400,
        message: 'Invalid Request. check req body: ' + addressInfo,
      });
    }
    if (
      typeof addressInfo.address.preferred !== 'boolean' ||
      typeof addressInfo.address.address_line_1 !== 'string' ||
      (addressInfo.address.address_line_2 !== null &&
        typeof addressInfo.address.address_line_2 !== 'string') ||
      typeof addressInfo.address.city !== 'string' ||
      typeof addressInfo.address.province !== 'string' ||
      typeof addressInfo.address.postal_code !== 'string' ||
      typeof addressInfo.address.recipient !== 'string' ||
      typeof addressInfo.address.telephone !== 'string'
    ) {
      errorGenerator({
        statusCode: 400,
        message: 'Invalid Request. req body is not in format',
      });
    }
    return addressInfo.address;
  }

  // payment
  public async getPaymentInfoByUserId(userId) {
    await this.checkIdExist(userId, 'user');
    return await UserModel.getPaymentInfoByUserId(userId);
  }

  public async getPaymentInfoByPaymentId(userId, paymentId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(paymentId, 'payment_method');

    return await UserModel.getPaymentInfoByPaymentId(userId, paymentId);
  }

  public async addPaymentByUserId(userId, paymentInfo) {
    await this.checkIdExist(userId, 'user');
    return await UserModel.addPaymentByUserId(userId, paymentInfo);
  }

  public async deletePaymentById(userId, paymentId) {
    await this.checkIdExist(paymentId, 'payment_method');
    return await UserModel.deletePaymentById(userId, paymentId);
  }

  public async updatePaymentById(paymentId, paymentInfo) {
    await this.checkIdExist(paymentId, 'payment_method');
    return await UserModel.updatePaymentById(paymentId, paymentInfo);
  }

  private async checkIdExist(id: number, table: string) {
    const result = await UserModel.checkIdExist(id, table);
    if (!result) {
      errorGenerator({
        message: `INVALID REQUEST: ${table} ${id} not exist`,
        statusCode: 422,
      });
    }
    return;
  }

  private isEmpty(obj: Record<string, unknown>) {
    return Object.keys(obj || {}).length === 0;
  }
}

export default new UserService();
//module.exports = UserService;
