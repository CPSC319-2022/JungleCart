import { Request, Response, Result } from "/opt/core/Router";
import OrderModel from "/opt/models/order/OrderModel";
import NetworkError from "/opt/core/NetworkError";
import { ProductModel } from "/opt/models/product/ProductModel";
import { Cart, CartProduct } from "/opt/types/cart";
import { Product } from "/opt/types/product";

export default class OrderController {
  private readonly orderModel: OrderModel;
  private readonly productModel: ProductModel;

  constructor(
  ) {
    this.orderModel = new OrderModel();
    this.productModel = new ProductModel();
  }

  public getOrderById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {
      const orderId = request.params.orderId;
      const order = await this.orderModel.read(orderId);
      return response.status(200).send(order);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };

  public createPendingOrder = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {

      const userId = request.params.userId;
      let { cart } = request.body;
      cart = cart.cart.cart[0] as Cart[];

      // remove products
      const products = await Promise.all(cart.products.map(async (cart_item: CartProduct) => {
        const product = await this.productModel.read(cart_item.id);
        if (!product) {
          throw new Error("there is at least product no longer available");
        }
        if (product.totalQuantity <= cart_item.quantity) {
          throw new Error("there is at least one item in your cart not available");
        }
        product.totalQuantity -= cart_item.quantity;
        return product;
      })) as Product[];

       await Promise.all(products.map(async (product: Product) => {
         await this.productModel.update(product.id, product);
      }));

      const orderId = await this.orderModel.write(userId);
      await this.logOrderItems(orderId, cart.products);
      const pendingOrder = await this.orderModel.read(orderId.toString());

      return response.status(200).send(pendingOrder);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };

  private async logOrderItems(orderId, cartItems) {
    const result = await Promise.all(cartItems.map(async (cartItem) => await this.orderModel.writeItem(orderId, cartItem.id, cartItem.quantity)));
  }

  public deleteOrderById = async (
  request: Request,
  response: Response
): Promise<Result> => {
    try {
      const order = await this.orderModel.delete("1");
      return response.status(200).send(order);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };


  public updateOrderById = async (
  request: Request,
  response: Response
): Promise<Result> => {
    try {
      const order = await this.orderModel.update();
      return response.status(200).send(order);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };

  public getOrders = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {
      const orders = await this.orderModel.read();
      // TODO: params for order
      return response.status(200).send(orders);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };



  public submitOrder = async (
  request: Request,
  response: Response
): Promise<Result> => {
    try {
      const order = await this.orderModel.update();
      return response.status(200).send(order);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };

}

