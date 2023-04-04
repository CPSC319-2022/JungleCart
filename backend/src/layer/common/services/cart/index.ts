import NetworkError from '/opt/core/NetworkError';
import CartModel from '/opt/models/cart/CartModel';

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
    const cart = (await CartModel.getCartItems(bid))[0];
    return cart.cart;
  }

  public async updateCartItems(id, info) {
    const rawCart = await CartModel.updateCartItems(id, info);
    return rawCart[0];
  }

  public async itemCount(bid, pid) {
    const count = await CartModel.isItemExist(bid, pid);
    const rst =
      JSON.parse(JSON.stringify(count))[0]['COUNT(*)'] !== 0
        ? JSON.parse(JSON.stringify(await CartModel.itemCount(bid, pid)))[0]
            .quantity
        : 0;
    return rst;
  }

  public async updateQuantity(info) {
    const rst = await CartModel.updateQuantity(info);
    const cart = JSON.parse(JSON.stringify(rst))[0];
    return { id: cart.product_id, quantity: cart.quantity };
  }
}

export default new CartService();
