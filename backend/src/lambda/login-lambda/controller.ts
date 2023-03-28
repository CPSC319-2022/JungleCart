import { Request, Response, Result } from '/opt/core/router';
import LoginService from '/opt/services/login';

class LoginController {
  constructor() {
    //
  }

  public async login(req: Request, res: Response) {
    const { email } = req.queryParam;
    const loginUser = await LoginService.login(email);
    return res.status(200).send(loginUser);
  }

  public async signup(req: Request, res: Response) {
    const userInput = req.body;
    const user = await LoginService.signup(userInput);
    return res.status(200).send(user);
  }
}

export default new LoginController();
