import { Request, Response } from 'express';
import { CartService } from '../service';
import { Cart_item } from '../utils/types';
import dotenv from 'dotenv';
dotenv.config();
import errorGenerator from '../utils/errorGenerator';
class CartController {
  public async getCartItems(req: Request, res: Response) {
    const rst = await CartService.getCartItems(req.params.userId.slice(1));
    return res.status(200).json(rst);
  }

  public async addCartItem(req: Request, res: Response) {
    const bid = Number(req.params.userId.slice(1));
    const info: Cart_item = {
      buyer_id: bid as number,
      product_id: req.body.id,
      quantity: req.body.quantity,
    };
    const ci = await CartService.addCartItem(info);
    res.status(201).send(ci);
  }

  public async updateCartItems(req: Request, res: Response) {
    const bid = Number(req.params.userId.slice(1));
    const body = req.body.cart_items;
    const info = body.map((e) => `(${bid}, ${e.id}, ${e.quantity})`).join(', ');
    const ci = await CartService.updateCartItems(bid, info);
    res.status(200).send(ci);
  }

  public async deleteCartItem(req: Request, res: Response) {
    await CartService.deleteCartItem(
      req.params.userId.slice(1),
      req.params.id.slice(1)
    );
    return res
      .status(200)
      .json(`product '${req.params.id.slice(1)}' removed from the cart`);
  }
}

export default new CartController();
