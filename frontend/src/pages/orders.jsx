import React from 'react';
import styles from '../styles/Orders.module.css';
import {orders} from '@/seeds/orders';
import {ShadedCard} from '@/components/organisms/shadedCard/ShadedCard';
import {CardTop} from '@/components/organisms/cardTop/CardTop';
import {CardBottom} from '@/components/organisms/cardBottom/CardBottom';
import Separator from '@/components/atoms/separator/Separator';

const OrdersPage = () => {
  const flattenedOrders = orders.orders.reduce((orders, order) => {
    const { products } = order;
    const orderItems = products.map((item) => ({
      ...item,
      date: order.created_at,
    }));
    return [...orders, ...orderItems];
  }, []);

  const deliveredOrders = flattenedOrders.filter(
    (order) => order.shipping_status === 'delivered'
  );
  const shippingOrders = flattenedOrders.filter(
    (order) => order.shipping_status !== 'delivered'
  );

  let options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return (
    <main>
      <section>
        <h2 className="section-header">Shipping</h2>
        <Separator />
        <div className={styles.gridContainer}>
          {shippingOrders.map((order) => (
            <ShadedCard key={order.id}>
              <CardTop {...order}></CardTop>
              <CardBottom className={styles.cardBottom}>
                <div className={styles.col}>
                  <h4>Expected Delivery</h4>
                  <p>
                    {new Intl.DateTimeFormat('en-US', options).format(
                      new Date()
                    )}
                  </p>
                </div>
                <button className={styles.actionButton}>Cancel</button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
      </section>
      <section>
        <h2 className="section-header">Delivered</h2>
        <Separator />
        <div className={styles.gridContainer}>
          {deliveredOrders.map((order) => (
            <ShadedCard key={order.id}>
              <CardTop {...order}></CardTop>
              <CardBottom className={styles.cardBottom}>
                <div className={styles.col}>
                  <h4>Expected Delivery</h4>
                  <p>
                    {new Intl.DateTimeFormat('en-US', options).format(
                      new Date()
                    )}
                  </p>
                </div>
                <button className={styles.actionButton}>Cancel</button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
      </section>
    </main>
  );
};

export default OrdersPage;
