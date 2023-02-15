import { Router } from 'express'
import { PathRouter } from '../utils/routers'
import asyncWrap from '../async-wrap'
import { CartController } from '../controllers'
class CartRouter extends PathRouter {
  constructor() {
    const path = '/carts'
    const router = Router()
    super(path, router)
    router.get('/:userId/items', asyncWrap(CartController.getCartItems))
    router.put('/:userId/items', asyncWrap(CartController.updateCartItems))
    router.post('/:userId/items', asyncWrap(CartController.addCartItem))
    router.delete(
      '/:userId/items/:itemId',
      asyncWrap(CartController.deleteCartItemById)
    )
  }
}
export default CartRouter
