import React, { useEffect } from 'react';
import ordersstyling from '@/pages/orders/Orders.module.css';
import { useRouter } from 'next/router';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import { UserCard } from '@/components/organisms/userCard/UserCard';
import Separator from '@/components/atoms/separator/Separator';
import OrdersTable from '@/components/organisms/ordersTable/OrdersTable';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { fetcher } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';
import { useSeller } from '@/hooks/useSeller';
import styles from './UserId.module.css'

const UserDetails = () => {
  const router = useRouter();
  const UserId = router.query.UserId;
  const { showPopup } = usePopupContext();

  const {user: currUser} = useUserContext();
  const {products, triggerSellerFetch} = useSeller(UserId);

  useEffect(() => {
    if (!currUser.isAdmin) {
      router.push('/products');
    }
  }, [currUser, router]);

  // useEffect(() => {
  //   if (!UserId) return;
  //   //get products user is selling
  //   fetcher({
  //     url: `/users/${UserId}/seller`,
  //     method: 'GET',
  //     token: _user_.accessToken,
  //   })
  //     .then((response) => setProducts(response.seller.products))
  //     .catch((error) => {
  //       console.log(error);
  //       //showPopup(popupStates.ERROR, error.message);
  //     });
  //   //get users
  //   fetcher({
  //     url: `/users/${UserId}`,
  //     method: 'GET',
  //     token: user.accessToken,
  //   })
  //     .then((response) => setUser(response.user))
  //     .then((response) => console.log(response))
  //     .catch((error) => {
  //       console.log(error);
  //       //showPopup(popupStates.ERROR, error.message);
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [UserId]);

  // const flattenedOrders =
  //   orders.orders.reduce((orders, order) => {
  //     //const { products } = order;
  //     const orderItems = products.map((item) => ({
  //       ...item,
  //       date: order.created_at,
  //     }));
  //     return [...orders, ...orderItems];
  //   }, []) ?? []; // from @/seeds/orders mock data until orders backend is fully implemented

  // // const productsOnSale = products.filter(
  // //   (product) => product.status === 'instock' && product.seller_id == UserId
  // // );

  // const deliveredOrders = flattenedOrders.filter(
  //   (order) => order.shipping_status === 'delivered'
  // );

  // const inProgressOrders = flattenedOrders.filter(
  //   (order) => order.shipping_status === 'in progress'
  // ); // // Commented out until orders is implemented

  // let options = {
  //   year: 'numeric',
  //   month: 'short',
  //   day: 'numeric',
  // };

  if (!UserId) {
    return <div></div>;
  }

  const deleteProduct = (product) => {
    //const { showPopup } = usePopupContext();
    fetcher({
      url: `/products/${product?.id}`,
      method: 'DELETE',
      token: currUser.accessToken,
    }).then((res) => {
      console.log('product ' + `${product?.id}` + ' has been deleted', res);
      showPopup(popupStates.SUCCESS, 'Product deleted from list!'); 
      triggerSellerFetch();
    }).catch((error) => {
      console.log(error);
      showPopup(popupStates.ERROR, error.message);
    });
  };
  

  return (
    <main>
      <section>
        <UserCard user_id={UserId} />
      </section>
      <section>
        <h2 className="section-header">Products Of User On Sale</h2>
        <Separator />
        <div className={styles.container}>
          {products?.map((product) => (
            <ShadedCard key={product.id}>
              <CardTop
                id={product.id}
                img={''}
                price={product.price}
                name={product.name}
              ></CardTop>
              <CardBottom className={ordersstyling.cardBottom}>
                <button
                  onClick={() => deleteProduct(product)}
                  className={ordersstyling.actionButton}
                >
                  Delete
                </button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
      </section>
      <section>
        <h2 className="section-header">Orders</h2>
        <Separator />
        <OrdersTable user_id={UserId} />
      </section>
    </main>
  );
};

export default UserDetails;
