import {CartModel} from '../models';
import dotenv from 'dotenv';

dotenv.config()

class CartService {
  public async addCartItem(info) {
    return await CartModel.addCartItem(info)
  }

  public async deleteCartItemById(id) {
    return await CartModel.deleteCartItemById(id)
  }

  public async getCartItems(id) {
    return await CartModel.getCartItems(id)
  }

  public async updateCartItems(id, info) {
    return await CartModel.updateCartItems(id, info)
  }
}

export default new CartService()
