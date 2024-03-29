import OrderController from './controller';
import Router, { ResponseContent } from '/opt/core/Router';

const controller: OrderController = new OrderController();

// set routing
const router: Router = new Router();
router.post('/orders', controller.createPendingOrder);
router.delete('/orders/{orderId}', controller.deleteOrderById);
router.get('/orders/{orderId}', controller.getOrderById);
router.post('/orders/{orderId}/process', controller.submitOrder);
router.get('/orders', controller.getOrders);
router.get('/orders/users/{userId}', controller.getUserOrders);
router.post('/orders/users/{userId}', controller.createPendingOrder);
router.put('/orders/{orderId}', controller.updateOrderById);
router.delete(
  '/orders/{orderId}/items/{productId}',
  controller.deleteOrderItem
);
router.put('/orders/{orderId}/items/{productId}', controller.updateOrderItem);
router.get('/orders/sellers/{sellerId}', controller.getSellerOrders);

// handles routing and sends request
exports.handler = async (event): Promise<ResponseContent> => {
  return await router.route(event);
};
