// import { ResponseContent, Router } from "../../layer/common/core/router";
// import OrderController from "@/lambdas/order-lambda/controller";
//
// const router: Router = new Router();
// const controller: OrderController = new OrderController();
//
// // set routing
// router.post('/orders', controller.placeOrder);
// router.delete('/orders/{ordersId}', controller.deleteOrderById);
// router.get('/orders/{ordersId}', controller.getOrderById);
// router.put('/orders/{ordersId}', controller.updateOrderById);
// router.get('/orders', controller.getProducts);
//
// // handles routing and sends request
// exports.handler = async (event): Promise<ResponseContent> => {
//   return await router.route(event);
// };
