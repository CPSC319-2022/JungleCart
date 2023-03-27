import CartModel from './model';
import NetworkError from '/opt/common/network-error';

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
      throw NetworkError.BAD_REQUEST.msg(
        'Target product does not exist in the cart'
      );
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

  public async itemCount(bid, pid) {
    const count = await CartModel.isItemExist(bid, pid);
    const rst =
      JSON.parse(JSON.stringify(count))[0]['COUNT(*)'] !== 0
        ? JSON.parse(JSON.stringify(await CartModel.itemCount(bid, pid)))[0]
            .quantity
        : count;
    return rst;
  }

  public async updateQuantity(info) {
    console.log('info in service', info);
    const rst = await CartModel.updateQuantity(info);
    const cart = JSON.parse(JSON.stringify(rst))[0];
    console.log('cart in service ::: ', cart);
    return { id: cart.product_id, quantity: cart.quantity };
  }
}

export default new CartService();
