import React, { useEffect } from 'react';
import ordersstyling from '@/pages/orders/Orders.module.css';
import { useRouter } from 'next/router';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import { UserCard } from '@/components/organisms/userCard/UserCard';
import Separator from '@/components/atoms/separator/Separator';
import OrdersTableBuyer from '@/components/organisms/ordersTableBuyer/OrdersTableBuyer';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { fetcherWithSpinner } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';
import { useSeller } from '@/hooks/useSeller';
import styles from './UserId.module.css';
import GorillaIllustration from '@/assets/gorillas_illustration.png';

const UserDetails = () => {
  const router = useRouter();
  const UserId = router.query.UserId;
  const { showPopup } = usePopupContext();

  const { user: currUser } = useUserContext();
  const { products, triggerSellerFetch } = useSeller(UserId);

  useEffect(() => {
    if (!currUser.isAdmin) {
      router.push('/products');
    }
  }, [currUser, router]);

  if (!UserId) {
    return <div></div>;
  }

  const deleteProduct = (e, product) => {
    //const { showPopup } = usePopupContext();
    fetcherWithSpinner(e.target, {
      url: `/products/${product?.id}`,
      method: 'DELETE',
      token: currUser.accessToken,
    })
      .then((res) => {
        console.log('product ' + `${product?.id}` + ' has been deleted', res);
        showPopup(popupStates.SUCCESS, 'Product deleted from list!');
        triggerSellerFetch();
      })
      .catch((error) => {
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
                img={product.img ?? GorillaIllustration}
                price={product.price}
                name={product.name}
              ></CardTop>
              <CardBottom className={ordersstyling.cardBottom}>
                <button
                  onClick={(e) => deleteProduct(e, product)}
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
        <OrdersTableBuyer user_id={UserId} />
      </section>
    </main>
  );
};

export default UserDetails;
