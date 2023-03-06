import {
  errorGenerator,
} from '/opt/customError-layer';
import { UserModel } from './UserModel';
const userModel = new UserModel();
import { ICreateAddressDto, IUpdateAddressDto }  from './user-dto';

export class UserService {
  constructor() {
    //
  }
  // admin
  public async listUsers() {
    return await userModel.listUsers();
  }

  public async addTempUser(newUser) {
    return await userModel.addTempUser(newUser);
  }

  // user
  public async addUser(info) {
    return await userModel.addUser(info);
  }

  public async updateUserInfoById(userId, userInfo) {
    await this.checkIdExist(userId, 'user');
    await this.validUpdateUserDto(userInfo);
    return await userModel.updateUserInfoById(userId, userInfo);
  }

  public async getUserInfoById(userId: number) {
    await this.checkIdExist(userId, 'user');
    return await userModel.getUserInfoById(userId);
  }

  public async getBuyerInfo(buyerId) {
    await this.checkIdExist(buyerId, 'buyer');
    return await userModel.getBuyerInfo(buyerId);
  }

  public async getSellerInfo(sellerId) {
    await this.checkIdExist(sellerId, 'seller');
    return await userModel.getSellerInfo(sellerId);
  }

  // address
  public async getAddresses(id) {
    await this.checkIdExist(id, 'address ');
    return await userModel.getAddresses(id);
  }

  public async getAddressesByUserId(userId) {
    await this.checkIdExist(userId, 'user');
    return await userModel.getAddressesByUserId(userId);
  }

  public async getAddressByAddressId(userId, addressId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    return await userModel.getAddressByAddressId(userId, addressId);
  }

  public async deleteAddressById(userId, addressId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    return await userModel.deleteAddressById(userId, addressId);
  }

  public async updateAddressById(userId, addressId, addressInfo) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    const newAddress:  IUpdateAddressDto =
      this.validUpdateAddressDto(addressInfo);
    return await userModel.updateAddressById(userId, addressId, newAddress);
  }

  public async addAddress(userId, addressInfo) {
    await this.checkIdExist(userId, 'user');
    const newAddress:  IUpdateAddressDto =
      this.validUpdateAddressDto(addressInfo);
    return await userModel.addAddress(userId, newAddress);
  }

  private validUpdateUserDto(userInfo) {
    // TODO
    if (this.isEmpty(userInfo) || this.isEmpty(userInfo['user'])) {
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
    return await userModel.getPaymentInfoByUserId(userId);
  }

  public async getPaymentInfoByPaymentId(userId, paymentId) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(paymentId, 'payment_method');

    return await userModel.getPaymentInfoByPaymentId(userId, paymentId);
  }

  public async addPaymentByUserId(userId, paymentInfo) {
    await this.checkIdExist(userId, 'user');
    const paymentId = await userModel.checkBuyerHasPaymentInfo(userId);
    const validPaymentInfo = await this.validPaymentInfo(paymentInfo);
    if (paymentId != null) {
      return await userModel.updatePaymentById(userId, validPaymentInfo);
    } else {
      return await userModel.addPaymentByUserId(userId, validPaymentInfo);
    }
  }

  public async deletePaymentById(userId, paymentId) {
    await this.checkIdExist(paymentId, 'payment_method');
    return await userModel.deletePaymentById(userId, paymentId);
  }

  public async updatePaymentById(paymentId, paymentInfo) {
    await this.checkIdExist(paymentId, 'payment_method');
    return await userModel.updatePaymentById(paymentId, paymentInfo);
  }

  private validPaymentInfo(paymentInfo) {
    if (this.isEmpty(paymentInfo) || this.isEmpty(paymentInfo['payment'])) {
      errorGenerator({
        statusCode: 400,
        message: 'Invalid Request. check req body: ' + paymentInfo,
      });
    }
    const { payment } = paymentInfo;
    if (!payment.is_credit && !payment.is_paypal) {
      errorGenerator({
        statusCode: 400,
        message:
          'Invalid Request. either paypal or creditcard inforamtion must be provided: ' +
          'credit ' +
          payment.is_credit +
          ' paypal : ' +
          payment.is_paypal,
      });
    }
    if (payment.is_credit) {
      if (
        typeof payment.bank_name !== 'string' ||
        typeof payment.card_num !== 'string' ||
        typeof payment.expiration_date !== 'string' ||
        typeof payment.first_name !== 'string' ||
        typeof payment.last_name !== 'string'
      ) {
        errorGenerator({
          statusCode: 400,
          message: 'Invalid Request. creditcard info is not in format',
        });
      }
    }
    if (payment.is_paypal && typeof payment.paypal_id !== 'string') {
      errorGenerator({
        statusCode: 400,
        message: 'Invalid Request. paypal info is not in format',
      });
    }

    return payment;
  }

  private async checkIdExist(id: number, table: string) {
    const result = await userModel.checkIdExist(id, table);
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

module.exports = { UserService };
