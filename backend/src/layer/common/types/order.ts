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


export {ProductOrder, OrderItem, OrderInfo, Order};


