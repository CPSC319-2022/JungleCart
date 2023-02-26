import {Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config()

class LoginController {
  constructor() {
    //
  }

  public async googleLogin(req: Request, res: Response) {
    //
  }

  public async logout(req: Request, res: Response) {
    //
  }
}

export default new LoginController();
