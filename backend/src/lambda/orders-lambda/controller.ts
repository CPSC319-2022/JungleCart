import { Request, Response, Result } from '/opt/core/Router';
import OrderModel, { OrderItemModel } from '/opt/models/order/OrderModel';
import NetworkError from '/opt/core/NetworkError';
import ProductModel from '/opt/models/product/primitive/ProductModel';
import { Cart, CartProduct } from '/opt/types/cart';
import CartService from '/opt/services/cart';
import { Product } from '/opt/types/product';
import { Order, OrderQuery, OrdersUpdateParams } from '/opt/types/order';
import { Cart_item } from '../../utils/types';

export default class OrderController {
  private readonly orderModel: OrderModel;
  private readonly productModel: ProductModel;
  private readonly orderItemModel: OrderItemModel;

  constructor() {
    this.orderModel = new OrderModel();
    this.productModel = new ProductModel();
    this.orderItemModel = new OrderItemModel();
  }

  public getSellerOrders = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {
      const { sellerId } = request.params;
      const sellerOrders = await this.orderModel.getSellerOrders(sellerId);
      return response.status(200).send(sellerOrders);
    } catch (e) {
      console.log(e);
      return response.throw(NetworkError.BAD_REQUEST);
    }
  };

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

  private isAnyPendingOrder = async (userId) => {
    const result = await this.orderModel.count('pending', userId);
    return result;
  };

  public createPendingOrder = async (
    request: Request,
    response: Response
  ): Promise<Result> => {
    try {
      const userId = request.params.userId;
      const cart: Cart = request.body.cart;

      const count: any[] = await this.isAnyPendingOrder(userId);

      if (count.length > 0 && count[0].id !== null) {
        return response.status(400).send({
          error: `there is already a pending order, please delete or complete order ${count[0].id}`,
        });
      }
      if (cart.products === null || cart.products.length === 0) {
        return response.status(400).send({ error: `Cart is empty` });
      }
      // remove products
      let subTotal = 0;
      const products = (await Promise.all(
        cart.products.map(async (cart_item: CartProduct) => {
          const product = await this.productModel.read(cart_item.id);
          if (!product) {
            return response.status(400).send({
              error: `there is at least one product no longer available - ${cart_item.id}`,
            });
          }
          if (product.totalQuantity < cart_item.quantity) {
            return response
              .status(400)
              .send({ error: `not enough in stock for - ${product.name}` });
          }
          product.totalQuantity -= cart_item.quantity;
          const price = product.discount !== undefined ? product.discount : 0;
          subTotal += cart_item.quantity * price;
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
      try {
        await this.emptyAllCartAfterOrder(cart, userId);
      } catch (e) {
        console.log('product id mismatch');
      }
      return response.status(200).send(pendingOrder[0]);
    } catch (e) {
      const error = e as Error;
      return response.throw(error);
    }
  };

  private emptyAllCartAfterOrder = async (cart, userId) => {
    await Promise.all(
      cart.products.map(async (cart_item: CartProduct) => {
        await CartService.deleteCartItem(userId, cart_item.id);
      })
    );
  };

  private revertProductsAfterOrder = async (orderId) => {
    const order: Order = (await this.orderModel.read({ order_id: orderId }))[0];
    const buyerId = (order as any).buyer_info.id;
    for (const cartItem of order.products) {
      if (!cartItem) {
        continue;
      }
      const item = cartItem as any;
      const product = await this.productModel.read(item.product_id);
      if (!product) {
        continue;
      }
      const totalQuantity = item.quantity + product.totalQuantity;
      await this.productModel.update(product.id, {
        totalQuantity: totalQuantity,
      });
      try {
        const info: Cart_item = {
          buyer_id: buyerId,
          product_id: item.product_id,
          quantity: item.quantity,
        };
        await CartService.addCartItem(info);
      } catch (e) {
        console.log(e);
      }
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
      const orderId = request.params.orderId;
      await this.revertProductsAfterOrder(orderId);
      await this.orderModel.delete(orderId);
      return response.status(200).send(`Order ${orderId} has been deleted`);
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

  public deleteOrderItem = async (Request, Response) => {
    const oid = Request.params.orderId;
    const pid = Request.params.productId;
    const total = await this.checkOrderStatus(oid, pid);
    const weightedPrice = await this.getWeightedPrice(oid, pid);
    const olog = await this.orderItemModel.deleteOrderItem(oid, pid);
    const orderiLog = JSON.parse(JSON.stringify(olog));
    if (orderiLog.affectedRows !== 1) {
      throw NetworkError.BAD_REQUEST.msg(
        'Target order item does not exist in the order'
      );
    } else {
      const orderLog = await this.orderModel.updateTotalPrice(
        oid,
        Math.round((total - weightedPrice) * 100 + Number.EPSILON) / 100
      );
      if (orderLog.affectedRows !== 1) {
        throw NetworkError.BAD_REQUEST.msg(
          'Removed order item, but could not update order total'
        );
      }
      return Response.status(200).send({
        message: `Product '${pid}' successfully removed from the order`,
      });
    }
  };

  public checkOrderItemExist = async (oid, pid) => {
    const order_count = JSON.parse(
      JSON.stringify(await this.orderModel.isOrderExist(oid))
    );
    const item_count = JSON.parse(
      JSON.stringify(await this.orderItemModel.isItemExist(oid, pid))
    );
    if (order_count[0]['COUNT(*)'] === 0 || item_count[0]['COUNT(*)'] === 0) {
      throw NetworkError.BAD_REQUEST.msg('Target does not exist');
    }
  };

  public checkOrderStatus = async (oid, pid) => {
    await this.checkOrderItemExist(oid, pid);
    const status = await this.orderModel.getOrderStatus(oid);
    const label = JSON.parse(JSON.stringify(status))[0]['label'];
    const total = JSON.parse(JSON.stringify(status))[0]['total'];
    if (label === 'shipped' || label === 'completed' || label === 'canceled') {
      throw NetworkError.BAD_REQUEST.msg(
        'Order is already shipped. You can not cancel the item'
      );
    }
    const shipstatus = await this.orderItemModel.getShippingStatus(oid, pid);
    const shipLabel = JSON.parse(JSON.stringify(shipstatus))[0]['status'];
    if (shipLabel === 'shipped' || shipLabel === 'delevered') {
      throw NetworkError.BAD_REQUEST.msg(
        'Item is already shipped. You can not cancel the item.'
      );
    }
    return total;
  };

  public getWeightedPrice = async (oid, pid) => {
    const rst = await this.orderItemModel.getWeightedPrice(oid, pid);
    return rst[0].quantity * (rst[0].price - rst[0].discount);
  };
  
  public updateOrderItem = async (Request, Response) => {
    const oid = Request.params.orderId;
    const pid = Request.params.productId;
    const status = Request.body.status;
    console.log('status', status);
    await this.checkOrderItemExist(oid, pid);
    const oi = await this.orderItemModel.updateOrderItem(oid, pid, status);
    const oiLog = JSON.parse(JSON.stringify(oi));
    if (oiLog.affectedRows !== 1) {
      throw NetworkError.BAD_REQUEST.msg(
        'Target order item does not exist in the order'
        );
      } else {
      await this.orderItemModel.updateOrderStatusByOrderId(oid);
      return Response.status(200).send('successfully updated');
    }
  };
}
