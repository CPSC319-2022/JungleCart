import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { CartController } from '../controllers'
class CartRouter extends PathRouter {
  constructor() {
    const path = '/carts/:userId/items'
    const router = Router()
    super(path, router)
    router.get('/', asyncWrap(CartController.getCartItems))
    router.put('/', asyncWrap(CartController.updateCartItems))
    router.post('/', asyncWrap(CartController.addCartItem))
    router.delete('/:id', asyncWrap(CartController.deleteCartItemById))
  }
}
export default CartRouter
