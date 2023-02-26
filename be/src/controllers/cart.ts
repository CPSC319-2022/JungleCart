import {Request, Response} from 'express';
import {CartService} from '../service';
import {Cart_item} from '../utils/types';
import dotenv from 'dotenv';

dotenv.config()

class CartController {
  public async getCartItems(req: Request, res: Response) {
    const rst = await CartService.getCartItems(req.params.id)
    return res.json(rst)
  }

  public async updateCartItems(req: Request, res: Response) {
    //
  }

  public async addCartItem(req: Request, res: Response) {
    const info: Cart_item = req.body
    const user = await CartService.addCartItem(info)
    res.send(user)
  }

  public async deleteCartItemById(req: Request, res: Response) {
    //
  }
}

export default new CartController()
