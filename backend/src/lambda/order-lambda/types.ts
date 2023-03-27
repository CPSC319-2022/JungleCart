export interface IOrderRequest {
  cartId: number;
  orders: IOrder[];
}


export interface IPendingOrder {
  userId: number;
  shipping: any;
  payment: any;
}


export interface IOrder {
  items: IOrderItem[];
}

export interface IOrderItem {
  id: string;
  shipping: any;
  quantity: number
}
