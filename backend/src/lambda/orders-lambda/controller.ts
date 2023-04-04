import { Request, Response, Result } from '/opt/core/Router';
import OrderModel from '/opt/models/order/OrderModel';
import NetworkError from '/opt/core/NetworkError';
import ProductModel from '/opt/models/product/primitive/ProductModel';
import { Cart, CartProduct } from '/opt/types/cart';
import { Product } from '/opt/types/product';
import { OrderQuery, OrdersUpdateParams } from '/opt/types/order';

export default class OrderController {
  private readonly orderModel: OrderModel;
  private readonly productModel: ProductModel;

  constructor() {
    this.orderModel = new OrderModel();
    this.productModel = new ProductModel();
  }

  public getOrderById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {
      const { orderId } = request.params;
      const orderQuery = request.query as OrderQuery;
      orderQuery.order_id = orderId;
      const order = await this.orderModel.read(orderQuery);
      return response.status(200).send(order[0]);
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
      const cart: Cart = request.body.cart;
      // remove products
      let subTotal = 0;
      const products = (await Promise.all(
        cart.products.map(async (cart_item: CartProduct) => {
          const product = await this.productModel.read(cart_item.id);
          if (!product) {
            throw new Error('there is at least product no longer available');
          }
          if (product.totalQuantity <= cart_item.quantity) {
            throw new Error(
              'there is at least one item in your cart not available'
            );
          }
          product.totalQuantity -= cart_item.quantity;
          subTotal += cart_item.quantity * product.price;
          return product;
        })
      )) as Product[];

      await Promise.all(
        products.map(async (product: Product) => {
          await this.productModel.update(product.id, product);
        })
      );

      const orderId = await this.orderModel.write(userId, subTotal);
      await this.logOrderItems(orderId, cart.products);
      const orderQuery: OrderQuery = { order_id: orderId };
      const pendingOrder = await this.orderModel.read(orderQuery);
      return response.status(200).send(pendingOrder[0]);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };

  private async logOrderItems(orderId, cartItems) {
    const result = await Promise.all(
      cartItems.map(
        async (cartItem) =>
          await this.orderModel.writeItem(
            orderId,
            cartItem.id,
            cartItem.quantity
          )
      )
    );
  }

  public deleteOrderById = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {
      return response.throw(NetworkError.BAD_REQUEST);
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
      const orderId = request.params.orderId;
      const orderUpdateParams: OrdersUpdateParams = request.body;
      if (!orderUpdateParams.orderStatus) {
        throw new Error('Missing status');
      }
      await this.orderModel.update(orderId, orderUpdateParams);
      return response.status(200).send({});
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
      const orderQuery = request.query as OrderQuery;
      const orders = await this.orderModel.read(orderQuery);
      return response.status(200).send(orders);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };

  public getUserOrders = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {
      const { userId } = request.params;
      const orderQuery = request.query as OrderQuery;
      const orders = await this.orderModel.read(orderQuery, userId);
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
      const orderId = request.params.orderId;
      const orderUpdateParams: OrdersUpdateParams = { orderStatus: 'ordered' };
      await this.orderModel.update(orderId, orderUpdateParams);
      return response.status(200).send({});
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };
}
