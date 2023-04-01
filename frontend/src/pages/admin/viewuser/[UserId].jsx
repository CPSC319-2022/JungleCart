import React, { useEffect, useState } from 'react';
import ordersstyling from '@/pages/orders/Orders.module.css';
import { useRouter } from 'next/router';
//import { products } from '@/seeds/products';
import { orders } from '@/seeds/orders';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import { UserCard } from '@/components/organisms/userCard/UserCard';
import Separator from '@/components/atoms/separator/Separator';
//import { users } from '@/seeds/users';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { fetcher } from '@/lib/api';


const UserDetails = () => {
  const router = useRouter();
  const UserId = router.query.UserId;
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { showPopup } = usePopupContext();

  useEffect(() => {
    if(!UserId) return;
    //get products user is selling
    fetcher({
      url: `/users/${UserId}/seller`,
      method: 'GET',
      token: user.accessToken,  
    }).then((response) => setProducts(response.seller.products))
  .catch((error) => {
    console.log(error);
    showPopup(popupStates.ERROR, error.message); 
  });
    //get users
    fetcher({
      url: `/users/${UserId}`,
      method: 'GET',
      token: user.accessToken,  
    }).then((response) => console.log(response))
  .catch((error) => {
    console.log(error);
    showPopup(popupStates.ERROR, error.message);
  })
    //get orders
    fetcher({
      url: `/orders?user_id=${UserId}`,
      method: 'GET',
      token: user.accessToken,  
    }).then((response) => console.log(response))
  .catch((error) => {
    console.log(error);
    showPopup(popupStates.ERROR, error.message);
  })
    
    
    // setUser(users.filter((user) => user.id == UserId)[0]);
  }, [UserId]);


  const flattenedOrders = orders?.orders?.reduce((orders, order) => {
    //const { products } = order;
    const orderItems = products.map((item) => ({
      ...item,
      date: order.created_at,
    }));
    return [...orders, ...orderItems];
  }, []) ?? [];

  // const productsOnSale = products.filter(
  //   (product) => product.status === 'instock' && product.seller_id == UserId
  // );

  const deliveredOrders = flattenedOrders.filter(
    (order) => order.shipping_status === 'delivered'
  );

  const inProgressOrders = flattenedOrders.filter(
    (order) => order.shipping_status === 'in progress'
  );

  let options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (!UserId) {
    return <div></div>;
  }

  const deleteProduct = (product) => {
    //const { showPopup } = usePopupContext();
    fetcher({
      url: `/products/${product?.id}`,
      method: 'DELETE',
      token: user.accessToken,
    }).then((res) => {
      console.log('product ' + `${product?.id}` + ' has been deleted', res);
      showPopup(popupStates.SUCCESS, 'Product deleted from list!'); 
      const remainingProducts = products.filter(p => product.id !== p.id);
      setProducts(remainingProducts)
    }).catch((error) => {
      console.log(error);
      showPopup(popupStates.ERROR, error.message);
    });
  };


  const deleteOrder = (order) => {
    fetcher({
      url: `/orders/${order?.id}`,
      method: 'DELETE',
      token: user.token,
    }).then((res) => {
      console.log('Order number ' + `${order?.id}` + ' is successfully deleted', res);
      showPopup(popupStates.SUCCESS, 'Order deleted from list!'); 
    }).catch((error) => {
      console.log(error);
      showPopup(popupStates.ERROR, error.message);
    });;
    };
  

  return (
    <main>
      <section>
        <UserCard user={user} />
      </section>
      <section>
        <h2 className="section-header">Products Of User On Sale</h2>
        <Separator />
        <div className={ordersstyling.gridContainer}>
          {products?.map((product) => (
            <ShadedCard key={product.id}>
              <CardTop
                id={product.id}
                img={""}
                price={product.price}
                name={product.name}
              ></CardTop>
              <CardBottom className={ordersstyling.cardBottom}>
                <button onClick={() => deleteProduct(product)} className={ordersstyling.actionButton}>Delete</button>
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
                <button onClick={() => deleteOrder(order)} 
                  className={ordersstyling.actionButton}>Delete</button>
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
};

export default UserDetails;
