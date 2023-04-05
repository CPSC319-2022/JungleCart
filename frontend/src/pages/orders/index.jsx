import React, { useEffect, useState } from 'react';
import styles from './Orders.module.css';
// import { orders } from '@/seeds/orders';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import Separator from '@/components/atoms/separator/Separator';
import { useOrders } from '@/hooks/useOrders';
import { fetcher } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';

const OrdersPage = () => {
  const [ordersCopy, setOrdersCopy] = useState([]);
  const { data: orders } = useOrders();

  const { user } = useUserContext();

  useEffect(() => {
    if (orders) {
      let sortedOrders = [...orders];
      sortedOrders.sort((a, b) => b.id - a.id);
      setOrdersCopy(sortedOrders);
    }
  }, [orders]);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const cancelOrder = (id) => {
    console.log('cancel order', id);
    const newOrder = ordersCopy.filter((order) => order.id !== id);
    fetcher({
      url: `/orders/${id}`,
      method: 'DELETE',
      token: user.accessToken,
    }).then((res) => {
      console.log(res);
      setOrdersCopy(newOrder);
    });
  };

  const cancelProduct = (orderId, productId) => {
    console.log('cancel product', productId);
    const newOrder = ordersCopy.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          products: order.products.filter(
            (product) => product.product_id !== productId
          ),
        };
      } else {
        return order;
      }
    });
    fetcher({
      url: `/orders/${orderId}/items/${productId}`,
      method: 'DELETE',
      token: user.accessToken,
    }).then((res) => {
      console.log(res);
      setOrdersCopy(newOrder);
    });
  };

  return (
    <main>
      <section>
        <h2 className="section-header">Orders</h2>
        <Separator />
        <div className={styles.container}>
          {ordersCopy.length ? (
            ordersCopy.map((order) => (
              <div key={order.id} className={styles.orderContainer}>
                <div className={styles.orderHeader}>
                  <div className={styles.row1}>
                    <h3>Order {order.id}</h3>
                    {order.status_label === 'in progress' && (
                      <p>{order.status_label}</p>
                    )}
                    <p className={styles.orderDate}>
                      {new Intl.DateTimeFormat('en-US', options).format(
                        new Date(order.created_at)
                      )}
                    </p>
                  </div>
                  <div className={styles.row2}>
                    {order.total && (
                      <p className={styles.orderTotal}>Total: ${order.total}</p>
                    )}
                    {order.status_label === 'ordered' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className={styles.cancelOrder}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.productsContainer}>
                  {order.products.map((product, index) => (
                    <ShadedCard key={product.product_id}>
                      <CardTop
                        {...product}
                        price={product.product_price}
                      ></CardTop>
                      <CardBottom className={styles.cardBottom}>
                        <div className={styles.col}>
                          <h4>Quantity</h4>
                          <p>{product.quantity}</p>
                        </div>
                        <div className={styles.col}>
                          <h4>Status</h4>
                          <p>{capitalize(product.status)}</p>
                        </div>
                        {product.status_label !== 'shipped' ? (
                          <button
                            onClick={() => cancelProduct(order.id, index)}
                            className={styles.actionButton}
                          >
                            Cancel
                          </button>
                        ) : (
                          <div className={styles.filler}></div>
                        )}
                      </CardBottom>
                    </ShadedCard>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>You don't have any orders</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default OrdersPage;
