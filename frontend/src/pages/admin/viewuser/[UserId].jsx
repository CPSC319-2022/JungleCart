import React from 'react';
import styles from '@/components/organisms/userCard/UserCard.module.css';
import ordersstyling from '@/pages/orders/Orders.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SortAndFilter } from '@/components/organisms/sortAndFilter/SortAndFilter';
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
  
  // beginning of backend functionality
  const [page, setPage] = useState(1);
  const [seller_products, setSellerProduct] = useState(products.products)

  useEffect(() => {
    console.log(seller_products);
  }, [seller_products])

  useEffect(() => {
  }, [page]); 
// end of backend functionality

  const { push, query } = useRouter();
  
  const routeToUser = async () => {    
        router.push(`/admins/${UserId}`);
  };

  const updateUrlParams = (key, value) => {
    const newQuery = Object.entries({ ...query, [key]: value }).reduce(
      (acc, [k, val]) => {
        if (!val) return acc;
        return { ...acc, [k]: val };
      },
      {}
    );
    push({ query: newQuery }, undefined, { shallow: true });
  };

  const flattenedOrders = orders.orders.reduce((orders, order) => {
    const { products } = order;
    const orderItems = products.map((item) => ({
      ...item,
      date: order.created_at,
    }));
    return [...orders, ...orderItems];
  }, []);

  const purchasedOrders = flattenedOrders.filter(
    (order) => order.shipping_status === 'delivered'
  );

  const productInfo = products.products.reduce((products, product) => {
    //const productCollection = product;
    const productBoxes = products.map((box) => ({
      ...box,
      productName: product.name
    }));
    return [...products, ...productBoxes];
  }, []);

  const productsOnSale = productInfo.filter(
    (product) => product.status === 'instock'
  );
  
  let options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return (
    <main>
      <SortAndFilter updateUrlParams={updateUrlParams} />
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
        <h2 className="section-header">Products of user on sale</h2>
        <Separator />
        <div className={ordersstyling.gridContainer}>
          {productsOnSale.map((product) => (
            <ShadedCard key={product.id}>
              <CardTop {...product}></CardTop>
              <CardBottom className={ordersstyling.cardBottom}>
                {/* <div className={styles.col}>
                  <h4>Expected Delivery</h4>
                  <p>
                    {new Intl.DateTimeFormat('en-US', options).format(
                      new Date()
                    )}
                  </p>
                </div> */}
                <button className={ordersstyling.actionButton}>Delete</button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
      </section>
      <section>
        <h2 className="section-header">Orders of user</h2>
        <Separator />
        <div className={ordersstyling.gridContainer}>
          {purchasedOrders.map((order) => (
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

        <div className="flex w-full justify-center p-5">
          <div className={ordersstyling.buttonGroup}>
            <button
            disabled={page === 1}
            className={ordersstyling.previous}
            onClick={() => setPage((page) => page - 1)}
            >
              «
            </button>
            <span>Page {page}</span>
            {/* TODO: disable next button if it's the last page */}
            <button
              className={ordersstyling.next}
              onClick={() => setPage((page) => page + 1)}
            >
              »
            </button>
          </div>
        </div>
    </main>
  );
}

export default UserDetails;