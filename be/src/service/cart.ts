import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { CartModel } from '../models';
import * as model from '../utils/types';
import * as dto from '../utils/types.dto';
import { TokenObj } from '../utils/token';
import errorGenerator from '../utils/errorGenerator';
import dotenv from 'dotenv';
dotenv.config();

class CartService {
  public async addCartItem(info) {
    return await CartModel.addCartItem(info);
  }

  public async deleteCartItem(id) {
    return await CartModel.deleteCartItem(id);
  }

  public async getCartItems(id) {
    return await CartModel.getCartItems(id);
  }

  public async updateCartItems(id, info) {
    return await CartModel.updateCartItems(id, info);
  }
}

export default new CartService();
