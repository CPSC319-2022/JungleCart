import {CartModel} from '../models';
import dotenv from 'dotenv';

dotenv.config()

class CartService {
  public async addCartItem(info) {
    return await CartModel.addCartItem(info)
  }

  public async deleteCartItem(bid, pid) {
    return await CartModel.deleteCartItem(bid, pid)
  }

  public async getCartItems(id) {
    return await CartModel.getCartItems(id)
  }

  public async updateCartItems(id, info) {
    return await CartModel.updateCartItems(id, info)
  }
}

export default new CartService()
