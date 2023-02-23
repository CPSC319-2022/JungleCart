import { BuyerModel } from '../models'
import * as model from '../utils/types'
import * as dto from '../utils/types.dto'
import { TokenObj } from '../utils/token'
import errorGenerator from '../utils/errorGenerator'
import dotenv from 'dotenv'
dotenv.config()

class BuyerService {
  public async listBuyers() {
    return await BuyerModel.listBuyers()
  }
  public async addBuyers(info) {
  return await BuyerModel.addBuyers(info)
  }
  
  public async getBuyerInfo(id) {
    return await BuyerModel.getBuyerInfo(id)
    
  }
  
  public async addPayment(id, info) {
  return await BuyerModel.addPayment(id, info)
  }

  public async deletePaymentById(id) {
    return await BuyerModel.deletePaymentById(id)
  }
  public async deletePaymentByBuyerId(buyer_id) {
    return await BuyerModel.deletePaymentByBuyerId(buyer_id)
  }

  public async updatePaymentById(id, info) {
    return await BuyerModel.updatePaymentById(id, info)
  }

  public async getPaymentInfoById(id) {
    return await BuyerModel.getPaymentInfoById(id)
  }

  public async getPaymentInfoByBuyerId(id) {
    return await BuyerModel.getPaymentInfoByBuyerId(id)
  }
}

export default new BuyerService()