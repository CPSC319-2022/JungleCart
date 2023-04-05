import React from 'react';
import styles from './Orders.module.css';
// import { orders } from '@/seeds/orders';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import Separator from '@/components/atoms/separator/Separator';
import { useOrders } from '@/hooks/useOrders';

const OrdersPage = () => {
  const { data: orders } = useOrders();

  // const inProgressOrders = orders?.filter(
  //   (order) => order.status_label === 'in progress'
  // );
  const orderedOrders = orders?.filter(
    (order) => order.status_label === 'ordered'
  );

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  console.log({ orders });

  const capitalize = (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  };

  const cancelOrder = (id) => {
    console.log('cancel order', id);
  };

  const cancelProduct = (id) => {
    console.log('cancel product', id);
  };

  return (
    <main>
      <section>
        <h2 className="section-header">Orders</h2>
        <Separator />
        <div className={styles.container}>
          {orderedOrders &&
            orderedOrders.map((order) => (
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
                  {order.products.map((product) => (
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
                          <p>{capitalize(product.status_label)}</p>
                        </div>
                        {product.status_label !== 'shipped' ? (
                          <button
                            onClick={() => cancelProduct(product.product_id)}
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
            ))}
        </div>
      </section>
    </main>
  );
};

export default OrdersPage;
