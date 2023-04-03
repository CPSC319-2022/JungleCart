interface Order {
  id: number;
  buyerId: number;
  orderStatusId: number;
  createdAt: string;
  updatedAt: string;
  products: ProductOrder[]
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  shippingStatusId: number;
  quantity: number;
}

interface OrderInfo {
  id: number;
  orderId: number;
  productId: number;
  shippingStatusId: number;
  quantity: number;
}

interface ProductOrder {
  id: number;
  name: string;
  price: number;
}


export interface OrderQuery {
  buyer_id?: number;
  seller_id?: number;
  sort_by?: number;
  sort_direction?: string;
  order_id?: number;
  product_id?: number;
}

interface OrdersInfo {
  order_id: number;
  order_created_at: Date;
  order_updated_at: Date;
  order_status_label: string;
  buyer_info: {
    id: number;
    address: {
      id: number;
      address_line_1: string;
      address_line_2: string;
      city: string;
      province: string;
      postal_code: string;
      recipient: string;
      telephone: string;
    };
  };
}

export {ProductOrder, OrderItem, OrdersInfo, Order};


