import React, { useEffect, useState } from 'react';
import ordersstyling from '@/pages/orders/Orders.module.css'
import { useRouter } from 'next/router';
import { products }from '@/seeds/products';
import { orders } from '@/seeds/orders';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import { UserCard } from '@/components/organisms/userCard/UserCard';
import Separator from '@/components/atoms/separator/Separator';
import { users } from '@/seeds/users';

const UserDetails = () => {
  const router = useRouter();
  const UserId = router.query.UserId;
  const [user, setUser] = useState({});

  useEffect(() => {
    //get user
    setUser(users.filter((user) => user.id == UserId)[0])
  }, [UserId])

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

  
  if (!UserId) {
    return <div></div>;
  }

  return (
    <main>
      <section>
        <UserCard user={user} />
      </section>
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