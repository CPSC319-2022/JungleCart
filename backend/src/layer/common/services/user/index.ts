import {
  ICreateAddressDto,
  IUpdateAddressDto,
} from '/opt/models/user/user-dto';
import UserModel from '/opt/models/user/UserModel';
import NetworkError from '/opt/core/NetworkError';

export class UserService {
  constructor() {
    //
  }
  // admin
  public async listUsers() {
    return await UserModel.listUsers();
  }

  private async validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }
  public async signup(userInput) {
    const signupUserInput = {
      email: userInput.email,
      firstName: userInput.firstName || '',
      lastName: userInput.lastName || '',
      departmentId: userInput.departmentId,
    };
    return await UserModel.signup(signupUserInput);
  }

  private async checkEmailExist(email: string) {
    return await UserModel.checkEmailExist(email);
  }

  public async getUserInfoByEmail(email: string) {
    if (!this.validateEmail(email)) {
      throw NetworkError.BAD_REQUEST.msg('email syntax error');
    }
    const isUserExist = await this.checkEmailExist(email);
    let user;
    if (isUserExist) {
      user = await UserModel.getUserInfoByEmail(email);
    }
    return user;
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
    await this.checkUserAddresses(userId, addressId);
    const prefAddressId = await UserModel.checkBuyerHasPrefAddress(userId);
    if (Number(prefAddressId) == Number(addressId)) {
      throw NetworkError.BAD_REQUEST.msg(
        'Invalid request. Default address can not be deleted'
      );
    }
    return await UserModel.deleteAddressById(userId, addressId);
  }

  public async updateAddressById(userId, addressId, addressInfo) {
    await this.checkIdExist(userId, 'user');
    await this.checkIdExist(addressId, 'address');
    const newAddress: IUpdateAddressDto =
      this.validUpdateAddressDto(addressInfo);
    return await UserModel.updateAddressById(userId, addressId, newAddress);
  }

  public async addAddress(userId, addressInfo) {
    await this.checkIdExist(userId, 'user');
    const newAddress: IUpdateAddressDto =
      this.validUpdateAddressDto(addressInfo);
    return await UserModel.addAddress(userId, newAddress);
  }

  private validUpdateUserDto(userInfo) {
    // TODO
    if (this.isEmpty(userInfo) || this.isEmpty(userInfo['user'])) {
      const msg = 'Invalid Request. check req body ' + userInfo;
      throw NetworkError.BAD_REQUEST.msg(msg);
    }
    if (
      typeof userInfo.user.first_name !== 'string' ||
      typeof userInfo.user.last_name !== 'string' ||
      (typeof userInfo.user.department_id !== 'number' &&
        userInfo.user.department_id !== null)
    ) {
      const msg = 'Invalid Request. req body is not in format';
      throw NetworkError.BAD_REQUEST.msg(msg);
    }
    return;
  }

  private validUpdateAddressDto(addressInfo) {
    if (this.isEmpty(addressInfo) || this.isEmpty(addressInfo['address'])) {
      const msg = 'Invalid Request. check req body: ' + addressInfo;
      throw NetworkError.BAD_REQUEST.msg(msg);
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
      const msg = 'Invalid Request. req body is not in format';
      throw NetworkError.BAD_REQUEST.msg(msg);
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

    return await UserModel.getPaymentInfoByPaymentId(paymentId);
  }

  public async addPaymentByUserId(userId, paymentInfo) {
    await this.checkIdExist(userId, 'user');
    const paymentId = await UserModel.checkBuyerHasPaymentInfo(userId);
    const validPaymentInfo = await this.validPaymentInfo(paymentInfo);
    if (Number(paymentId) > 0) {
      return await UserModel.updatePaymentById(paymentId, validPaymentInfo);
    } else {
      return await UserModel.addPaymentByUserId(userId, validPaymentInfo);
    }
  }

  public async deletePaymentById(userId, paymentId) {
    await this.checkIdExist(paymentId, 'payment_method');
    return await UserModel.deletePaymentById(userId, paymentId);
  }

  public async updatePaymentById(paymentId, paymentInfo) {
    await this.checkIdExist(paymentId, 'payment_method');
    const validPaymentInfo = await this.validPaymentInfo(paymentInfo);
    return await UserModel.updatePaymentById(paymentId, validPaymentInfo);
  }

  private validPaymentInfo(paymentInfo) {
    if (this.isEmpty(paymentInfo) || this.isEmpty(paymentInfo['payment'])) {
      const msg = 'Invalid Request. check req body: ' + paymentInfo;
      throw NetworkError.BAD_REQUEST.msg(msg);
    }
    const { payment } = paymentInfo;
    if (!payment.is_credit && !payment.is_paypal) {
      const msg =
        'Invalid Request. either paypal or credit card information must be provided: ' +
        'credit ' +
        payment.is_credit +
        ' paypal : ' +
        payment.is_paypal;
      throw NetworkError.BAD_REQUEST.msg(msg);
    }
    if (payment.is_credit) {
      if (
        typeof payment.bank_name !== 'string' ||
        typeof payment.card_num !== 'string' ||
        typeof payment.expiration_date !== 'string' ||
        typeof payment.first_name !== 'string' ||
        typeof payment.last_name !== 'string' ||
        !this.isNumberChar(payment.card_num)
      ) {
        const msg = 'Invalid Request. creditcard info is not in format';
        throw NetworkError.BAD_REQUEST.msg(msg);
      }
    }
    if (payment.is_paypal && typeof payment.paypal_id !== 'string') {
      const msg = 'Invalid Request. paypal info is not in format';
      throw NetworkError.BAD_REQUEST.msg(msg);
    }

    return payment;
  }

  private isNumberChar(char: string): boolean {
    return !isNaN(Number(char));
  }

  private async checkIdExist(id: number, table: string) {
    const result = await UserModel.checkIdExist(id, table);
    if (!result) {
      const msg = `Unprocessable content. ${table} ${id} not exist`;
      throw NetworkError.UNPROCESSABLE_CONTENT.msg(msg);
    }
    return;
  }

  private async checkUserAddresses(userId, addressId) {
    const result = await UserModel.checkUserAddresses(userId, addressId);
    if (!result) {
      throw NetworkError.BAD_REQUEST.msg(
        `Invalid request. address ${addressId} is not user ${userId}'s address`
      );
    }
  }

  private isEmpty(obj: Record<string, unknown>) {
    return Object.keys(obj || {}).length === 0;
  }
}
export default new UserService();
