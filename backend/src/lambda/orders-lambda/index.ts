import OrderController from "./controller";
import Router, { ResponseContent } from "/opt/core/Router";

const controller: OrderController = new OrderController();

// set routing
const router: Router = new Router();
router.post("/orders", controller.createPendingOrder);
router.delete("/orders/{orderId}", controller.deleteOrderById);
router.get("/orders/{orderId}", controller.getOrderById);
router.patch("/order/{orderId}", controller.updateOrderById);
router.patch("/order/{orderId}/process", controller.submitOrder);
router.get("/orders", controller.getOrders);
router.get("/orders/users/{userId}", controller.getUserOrders);
router.post("/orders/users/{userId}", controller.createPendingOrder);
router.put("/orders/{orderId}", controller.updateOrderById);

// handles routing and sends request
exports.handler = async (event): Promise<ResponseContent> => {
  return await router.route(event);
};
