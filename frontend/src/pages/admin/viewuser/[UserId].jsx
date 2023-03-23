import React from 'react';
import styles from '@/components/organisms/userCard/UserCard.module.css';
import ordersstyling from '@/pages/orders/Orders.module.css'
//import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
//import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import Image from 'next/image';
import iconUserGreen from '@/assets/Icon-User-green.png';
import { products }from '@/seeds/products';
import { orders } from '@/seeds/orders';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import Separator from '@/components/atoms/separator/Separator';

const UserDetails = () => {
  const router = useRouter();
  const UserId = router.query.UserId;
  
  if (!UserId) {
    return <div></div>;
  }

  const routeToUser = async () => {    
        router.push(`/admins/${UserId}`);
  };

  const flattenedOrders = orders.orders.reduce((orders, order) => {
    const { products } = order;
    const orderItems = products.map((item) => ({
      ...item,
      date: order.created_at,
    }));
    return [...orders, ...orderItems];
  }, []);

  const productsOnSale = products.products.filter(
    (product) => product.status === 'instock' && product.seller_id == UserId
  );
  
  const deliveredOrders = flattenedOrders.filter(
    (order) => order.shipping_status === 'delivered'
  );

  const inProgressOrders = flattenedOrders.filter(
    (order) => order.shipping_status === 'in progress'
  )
  
  let options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return (
    <main>
      <div
      className={`${styles.card} hover:shadow-lg rounded-md shadow-md bg-gray-light`}
    >
      <div className=" relative md:container h-60  p-5">
        <figure>
          {' '}
          <Image
            className=" object-scale-down p-5"
            src={iconUserGreen}
            alt="PNG User image"
            fill
            onClick={() => router.push(`/admin/viewuser/${UserId}`)}
          />  
        </figure>
      </div>
      <div className={styles.info}>
        <div
          className="tooltip tooltip-closed tooltip-top tooltip-primary text-left"
          data-tip={UserId}
        >
          <h2 className={styles.title}>User {`${UserId}`}</h2>
        </div>
        <div className="w-full flex justify-between">
          
          <button className={styles.button} 
          onClick={routeToUser}
          >
            To User {`${UserId}`} Dashboard
          </button>
        </div>
      </div>
    </div>
      <section>
        <h2 className="section-header">Products Of User On Sale</h2>
        <Separator />
        <div className={ordersstyling.gridContainer}>
          {productsOnSale.map((product) => (
            <ShadedCard key={product.id}>
              <CardTop id={product.id} img={product.img[0]} price={product.price} name={product.name}></CardTop>
              <CardBottom className={ordersstyling.cardBottom}>
                <button className={ordersstyling.actionButton}>Delete</button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
      </section>
      <section>
        <h2 className="section-header">Delivered Orders</h2>
        <Separator />
        <div className={ordersstyling.gridContainer}>
          {deliveredOrders.map((order) => (
            <ShadedCard key={order.id}>
              <CardTop {...order}></CardTop>
              <CardBottom className={ordersstyling.cardBottom}>
                <div className={ordersstyling.col}>
                  <h4>Expected Delivery</h4>
                  <p>
                    {new Intl.DateTimeFormat('en-US', options).format(
                      new Date()
                    )}
                  </p>
                </div>
                <button className={ordersstyling.actionButton}>Delete</button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
      </section>
      <section>
        <h2 className="section-header">Orders In Progress</h2>
        <Separator />
        <div className={ordersstyling.gridContainer}>
          {inProgressOrders.map((order) => (
            <ShadedCard key={order.id}>
              <CardTop {...order}></CardTop>
              <CardBottom className={ordersstyling.cardBottom}>
                <div className={ordersstyling.col}>
                  <h4>Expected Delivery</h4>
                  <p>
                    {new Intl.DateTimeFormat('en-US', options).format(
                      new Date()
                    )}
                  </p>
                </div>
                <button className={ordersstyling.actionButton}>Cancel</button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
      </section> 
    </main>
  );
}

export default UserDetails;