// import {Request, Response, Result} from "../../layer/common/core/router";
// import NetworkError from "../../layer/common/core/network-error";
// import {IPendingOrder} from "./types";
// import { OrderModel } from "../../layer/common/models/product/ProductModel";
//
// export default class OrderController {
//   private readonly orderModel: OrderModel = new OrderModel();
//
//   public placeOrder = async (request: Request, response: Response): Promise<any> => {
//     const pendingOrder = request.body as IPendingOrder;
//     // get cart
//     // verify shipping
//     // verify payment
//     // create order
//   };
//
//   public getOrderById = async (request: Request, response: Response): Promise<any> => {
//     const { body } = request;
//   };
//
//   public updateOrderById = async (request: Request, response: Response): Promise<any> => {
//     const { body } = request;
//   };
//
//   public deleteOrderById = async (request: Request, response: Response): Promise<any> => {
//     const { body } = request;
//   };
//
//   public deleteProductById = async (request: Request, response: Response): Promise<any> => {
//   };
//
// }
