import React, { useEffect, useState } from 'react';
import styles from './Orders.module.css';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import Separator from '@/components/atoms/separator/Separator';
import { useOrders } from '@/hooks/useOrders';
import { fetcherWithSpinner } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';

const OrdersPage = () => {
  const [ordersCopy, setOrdersCopy] = useState([]);
  const { data: orders, loading } = useOrders();

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
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  };

  const cancelOrder = (e, orderToCancel) => {
    const newOrder = ordersCopy.filter(
      (order) => orderToCancel.id !== order.id
    );
    fetcherWithSpinner(e.target, {
      url: `/orders/${orderToCancel.id}`,
      method: 'DELETE',
      token: user.accessToken,
    }).then(() => {
      setOrdersCopy(newOrder);
    });
  };

  if (loading) {
    return (
      <main>
        <section>
          <h2 className="section-header">Orders</h2>
          <Separator />
          <div className="animate-pulse w-full">
            <div className="flex justify-between gap-8 flex-wrap sm:flex-nowrap">
              <div className="h-52 w-80 bg-base-200 rounded-2xl shrink" />
              <div className="h-52 w-80 bg-base-200 rounded-2xl " />
              <div className="h-52 w-80 bg-base-200 rounded-2xl " />
            </div>
          </div>
        </section>
      </main>
    );
  }

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
                    <h3># {order.id}</h3>
                    <p className={styles.orderStatus}>
                      {capitalize(order.status_label)}
                    </p>
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
                    {(order.status_label === 'pending' ||
                      order.status_label === 'ordered') && (
                      <button
                        onClick={(e) => cancelOrder(e, order)}
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
                        img={product.url}
                        id={product.product_id}
                        price={product.product_price}
                      ></CardTop>
                      <CardBottom className={styles.cardBottom}>
                        <div className={styles.col}>
                          <h4>Quantity</h4>
                          <p>{product.quantity}</p>
                        </div>
                        <div className={styles.col}>
                          <h4>Shipping Status</h4>
                          <p>{capitalize(product.status)}</p>
                        </div>
                      </CardBottom>
                    </ShadedCard>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>You do not have any orders</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default OrdersPage;
