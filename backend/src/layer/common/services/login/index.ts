import {
  ICreateAddressDto,
  IUpdateAddressDto,
} from '/opt/models/user/user-dto';
import LoginModel from '/opt/models/login/LoginModel';
import NetworkError from '/opt/core/network-error';

export class LoginService {
  constructor() {
    //
  }

  public async login(email) {
    if (!this.validateEmail(email)) {
      const msg = 'Invalid Request. EMAIL_NOT_VALID';
      throw NetworkError.BAD_REQUEST.msg(msg);
    }
    const isUserExist = await LoginModel.checkEmailExist(email);
    let user;
    if (isUserExist) {
      // login
      user = await LoginModel.login(email);
    } else {
      throw NetworkError.NOT_FOUND.msg('no user data');
    }
    return user;
  }

  public async signup(userInput) {
    const signupUserInput = {
      email: userInput.mail,
      firstName: userInput.firstName || '',
      lastName: userInput.lastName || '',
      department_id: userInput.departmentId || null,
    };

    return await LoginModel.signup(signupUserInput);
  }
  private async validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  private async checkEmailExist(email: string) {
    return await LoginModel.checkEmailExist(email);
  }
}

export default new LoginService();
