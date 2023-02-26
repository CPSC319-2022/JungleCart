import {SellerModel} from '../models';
import dotenv from 'dotenv';

dotenv.config()

class SellerService {
  constructor() {
  }
  
  public async getSellerInfo(id) {
    return await SellerModel.getSellerInfo(id)
  }

  public async addSeller (info){
  return await SellerModel.addSeller(info)
  }

  public async getAllSeller () {
    return await SellerModel.getAllSeller()
  }
}

export default new SellerService()
