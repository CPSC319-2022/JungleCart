import { Request, Response, Result } from '/opt/core/Router';
import OrderModel, { OrderItemModel } from '/opt/models/order/OrderModel';
import NetworkError from '/opt/core/NetworkError';
import ProductModel from '/opt/models/product/primitive/ProductModel';
import { Cart, CartProduct } from '/opt/types/cart';
import { Product } from '/opt/types/product';
import { OrderQuery, OrdersUpdateParams } from '/opt/types/order';

export default class OrderController {
  private readonly orderModel: OrderModel;
  private readonly productModel: ProductModel;
  private readonly orderItemModel: OrderItemModel;

  constructor() {
    this.orderModel = new OrderModel();
    this.productModel = new ProductModel();
    this.orderItemModel = new OrderItemModel();
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

  public deleteOrderItem = async (Request, Response) => {
    try {
      const oid = Request.params.orderId;
      const iid = Request.params.itemId;
      const total = await this.checkOrderStatus(oid, iid);
      const weightedPrice = await this.getWeightedPrice(iid);
      const olog = await this.orderItemModel.deleteOrderItem(oid, iid);
      const orderiLog = JSON.parse(JSON.stringify(olog));
      if (orderiLog.affectedRows !== 1) {
        throw NetworkError.BAD_REQUEST.msg(
          'Target order item does not exist in the order'
        );
      } else {
        const orderLog = await this.orderModel.updateTotalPrice(
          oid,
          total - weightedPrice
        );
        if (orderLog.affectedRows !== 1) {
          throw NetworkError.BAD_REQUEST.msg(
            'Removed order item, but could not update order total'
          );
        }
        return Response.status(200).send({
          message: `Item '${iid}' successfully removed from the order`,
        });
      }
    } catch (e) {
      const error = e as NetworkError;
      return Response.status(400).send(error.message);
    }
  };

  public checkOrderStatus = async (oid, iid) => {
    const order_count = JSON.parse(
      JSON.stringify(await this.orderModel.isOrderExist(oid))
    );
    const item_count = JSON.parse(
      JSON.stringify(await this.orderItemModel.isItemExist(iid))
    );
    if (order_count[0]['COUNT(*)'] === 0 || item_count[0]['COUNT(*)'] === 0) {
      throw NetworkError.BAD_REQUEST.msg('Target does not exist');
    }
    const status = await this.orderModel.getOrderStatus(oid);
    const label = JSON.parse(JSON.stringify(status))[0]['label'];
    const total = JSON.parse(JSON.stringify(status))[0]['total'];
    if (label === 'shipped' || label === 'completed' || label === 'canceled') {
      throw NetworkError.BAD_REQUEST.msg(
        'Order is already shipped. You can not cancel the item'
      );
    }
    const shipstatus = await this.orderItemModel.getShippingStatus(iid);
    const shipLabel = JSON.parse(JSON.stringify(shipstatus))[0]['status'];
    if (shipLabel === 'shipped' || shipLabel === 'delevered') {
      throw NetworkError.BAD_REQUEST.msg(
        'Item is already shipped. You can not cancel the item.'
      );
    }
    return total;
  };

  public getWeightedPrice = async (iid) => {
    const rst = await this.orderItemModel.getWeightedPrice(iid);
    return rst[0].quantity * (rst[0].price - rst[0].discount);
  };
}
