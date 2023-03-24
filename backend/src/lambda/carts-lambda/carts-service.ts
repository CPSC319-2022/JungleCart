import CartModel from './carts-model';
import { NotFoundError } from '/opt/sql-layer';

class CartService {
  public async addCartItem(info) {
    const rst = await CartModel.addCartItem(info);
    const cart = JSON.parse(JSON.stringify(rst))[0];
    return { id: cart.product_id, quantity: cart.quantity };
  }

  public async deleteCartItem(bid, pid) {
    const cartLog = await CartModel.deleteCartItem(bid, pid);
    const cart = JSON.parse(JSON.stringify(cartLog));
    if (cart.affectedRows == 1) {
      return { message: `product '${pid}' removed from the cart` };
    } else {
      throw new NotFoundError('Target product does not exist in the cart');
    }
  }

  public async getCartItems(bid) {
    const cart = await CartModel.getCartItems(bid);
    return JSON.parse((cart as object)[0].cart);
  }

  public async updateCartItems(id, info) {
    const rawCart = await CartModel.updateCartItems(id, info);
    console.log('rawCart ::::: ', rawCart);
    return JSON.parse(JSON.stringify(rawCart[0]));
  }
}

export default new CartService();
