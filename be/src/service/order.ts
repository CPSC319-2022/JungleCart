import { Request, Response } from 'express';
import { OrderModel } from '../models';
import * as model from '../utils/types';
import * as dto from '../utils/types.dto';
import { TokenObj } from '../utils/token';
import errorGenerator from '../utils/errorGenerator';
import dotenv from 'dotenv';
dotenv.config();

class OrderService {
  constructor() {
    //
  }

  public async addOrder(info) {
    // return await OrderModel.addOrder(info)
  }
  public async deleteOrderById(id) {
    // return await OrderModel.deleteOrderById(id)
  }
  public async getOrderInfoById(id) {
    // return await OrderModel.getOrderInfoById(id)
  }
  public async getOrderInfoByBuyerId(buyer_id) {
    // return await OrderModel.getOrderInfoByBuyerId(buyer_id)
  }
  public async listAllOrderItems() {
    // return await OrderModel.listAllOrderItems()
  }
  public async listOrderItmesByOrderId(id) {
    // return await OrderModel.listOrderItmesByOrderId(id)
  }
  public async getOrders() {
    // return await OrderModel.getOrders()
  }
  public async getAllSeller() {
    // return await OrderModel.getAllSeller()
  }
  public async updateOrderInfoById(id) {
    // return await OrderModel.updateOrderInfoById(id)
  }
  public async checkoutOrderById(id) {
    // return await OrderModel.checkoutOrderById(id)
  }
}

export default new OrderService();
