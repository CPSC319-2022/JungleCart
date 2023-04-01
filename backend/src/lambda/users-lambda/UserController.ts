import NetworkError from '/opt/core/network-error';
import { Request, Response, Result } from '/opt/core/router';
import UserService from '/opt/services/user';
import jwt from '/opt/nodejs/node_modules/jsonwebtoken';

class UserController {
  constructor() {
    //
  }
  public async validateUser(req: Request, res: Response): Promise<Result> {
    if (!req.headers) {
      throw NetworkError.BAD_REQUEST.msg('no header :: ' + req.headers);
    }
    const idToken = req.headers['Authorization'].split(' ')[1];
    if (!idToken) {
      throw NetworkError.BAD_REQUEST.msg(
        'Invalid request. id token not found in header'
      );
    }
    const userRawData = decodeIdToken(idToken);
    const { email, first_name, last_name, department_id } = userRawData;
    if (!email)
      throw NetworkError.BAD_REQUEST.msg(
        'email not found in id token :: ' + userRawData
      );
    let user;
    user = await UserService.getUserInfoByEmail(email);
    if (!user) {
      user = await UserService.signup({
        email,
        first_name,
        last_name,
        department_id,
      });
    }
    if (!user) {
      throw NetworkError.INTERNAL_SERVER;
    }
    return res.status(200).send(user);
  }

  public async getUserList(req: Request, res: Response): Promise<Result> {
    const users = await UserService.listUsers();
    return res.status(200).send(users);
  }

  public async addTempUser(req: Request, res: Response): Promise<Result> {
    const newUser = JSON.parse(req.body);
    const user = await UserService.addTempUser(newUser);
    return res.status(200).send(user);
  }

  // user
  public async addUser(req: Request, res: Response): Promise<Result> {
    const newUser = JSON.parse(req.body);
    const user = await UserService.addUser(newUser);
    return res.status(200).send(user);
  }

  public async getUserInfoById(req: Request, res: Response): Promise<Result> {
    const userId = req.params.userId;
    const user = await UserService.getUserInfoById(userId);
    return res.status(200).send(user);
  }

  public async updateUserInfoById(
    req: Request,
    res: Response
  ): Promise<Result> {
    const userInfo = JSON.parse(req.body);
    const userId = Number(req.params.userId);
    const updatedUserInfo = await UserService.updateUserInfoById(
      userId,
      userInfo
    );
    return res.status(200).send({
      message: 'updated user info',
      address: updatedUserInfo,
    });
  }

  public async getBuyerInfo(req: Request, res: Response): Promise<Result> {
    const userId = Number(req.params.userId);
    const buyer = await UserService.getBuyerInfo(userId);
    return res.status(200).send(buyer);
  }

  public async getSellerInfo(req: Request, res: Response): Promise<Result> {
    const userId = Number(req.params.userId);
    const seller = await UserService.getSellerInfo(userId);
    return res.status(200).send(seller);
  }

  // Address
  public async getAddresses(req: Request, res: Response): Promise<Result> {
    const userId = req.params.userId;
    const addresses = await UserService.getAddresses(userId);
    return res.status(200).send(addresses);
  }

  public async getAddressesByUserId(
    req: Request,
    res: Response
  ): Promise<Result> {
    const userId = req.params.userId;
    const addresses = await UserService.getAddressesByUserId(userId);
    return res.status(200).send(addresses);
  }

  public async getAddressByAddressId(
    req: Request,
    res: Response
  ): Promise<Result> {
    const { userId, addressId } = req.params;
    const address = await UserService.getAddressByAddressId(userId, addressId);
    return res.status(200).send(address);
  }

  public async addAddress(req: Request, res: Response): Promise<Result> {
    const userId = req.params.userId;
    const addressReq = JSON.parse(req.body);
    const newAddress = await UserService.addAddress(userId, addressReq);
    return res.status(200).send({
      message: 'created address.',
      address: newAddress,
    });
  }

  public async deleteAddressById(req: Request, res: Response): Promise<Result> {
    const { userId, addressId } = req.params;
    await UserService.deleteAddressById(userId, addressId);
    return res.status(200).send({ message: 'deleted address' });
  }

  public async updateAddressById(req: Request, res: Response): Promise<Result> {
    const { userId, addressId } = req.params;
    const addInfo = JSON.parse(req.body);
    const updatedAddress = await UserService.updateAddressById(
      userId,
      addressId,
      addInfo
    );
    return res.status(200).send({
      message: 'updated address.',
      address: updatedAddress,
    });
  }

  // payment
  public async getPaymentInfoByUserId(
    req: Request,
    res: Response
  ): Promise<Result> {
    const userId = req.params.userId;
    const payment = await UserService.getPaymentInfoByUserId(userId);
    return res.status(200).send(payment);
  }

  public async getPaymentInfoByPaymentId(
    req: Request,
    res: Response
  ): Promise<Result> {
    const { userId, paymentId } = req.params;
    const payment = await UserService.getPaymentInfoByPaymentId(
      userId,
      paymentId
    );
    return res.status(200).send(payment);
  }

  public async addPaymentByUserId(
    req: Request,
    res: Response
  ): Promise<Result> {
    const userId = req.params.userId;
    const paymentInfo = JSON.parse(req.body);
    const paymentId = await UserService.addPaymentByUserId(userId, paymentInfo);
    return res.status(200).send(paymentId);
  }

  public async deletePaymentById(req: Request, res: Response): Promise<Result> {
    const { userId, paymentId } = req.params;
    await UserService.deletePaymentById(userId, paymentId);
    return res.status(200).send({ message: 'deleted payment' });
  }

  public async updatePaymentById(req: Request, res: Response): Promise<Result> {
    const { userId, paymentId } = req.params;
    const paymentInfo = JSON.parse(req.body);
    await UserService.updatePaymentById(paymentId, paymentInfo);
    return res.status(200).send({ message: 'updated payment' });
  }
}

const decodeIdToken = (idToken) => {
  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded) {
    const msg =
      'userRawData:: token == ' +
      idToken +
      '\n' +
      'decoded :: ' +
      { ...decoded };
    throw NetworkError.BAD_REQUEST.msg(msg);
  }
  return decoded.payload;
};

export default new UserController();
