import {Request, Response} from 'express';
import * as model from '../utils/types';
import {SellerService} from './../service';
import dotenv from 'dotenv';

dotenv.config()

class SellerController {
  
  public async getSellerInfo(req: Request, res: Response) {
    const seller = await SellerService.getSellerInfo(req.params['id'].slice(1))
    res.status(200).json({ seller })
  }
  public async addSeller (req: Request, res: Response) {
  console.log(req)
  const info:model.Seller = req.body
  const user = SellerService.addSeller(info)
  res.send(user)
}

public async getAllSeller (req: Request, res: Response) {
  const rst = await SellerService.getAllSeller()
  return res.json(rst)
  
}
}

export default new SellerController()
