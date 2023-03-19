export interface IOrderRequest {
  user_id: number;
  orders: IOrder[];
}


export interface IOrder {
  items: IOrderItem[];
}

export interface IOrderItem {
  id: string;
  shipping: any;
  quantity: number
}
