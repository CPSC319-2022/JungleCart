//import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './Inventory.module.css';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import Separator from '@/components/atoms/separator/Separator';
import emptyBox from '@/assets/emptyBox.svg';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button/Button';
import { useInventory } from '@/hooks/useInventory';
import { fetcherWithSpinner } from '@/lib/api';
import { usePopupContext, popupStates } from '@/contexts/PopupContext';

import ordersstyling from '@/pages/orders/Orders.module.css';
import { useUserContext } from '@/contexts/UserContext';
import GorillaIllustration from '@/assets/gorillas_illustration.png';

const InventoryPage = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { showPopup } = usePopupContext();
  const { products, triggerInventoryFetch } = useInventory();

  const deleteProduct = (e, product) => {
    fetcherWithSpinner(e.target, {
      url: `/products/${product?.id}`,
      method: 'DELETE',
      token: user.accessToken,
    })
      .then((res) => {
        console.log('product ' + `${product?.id}` + ' has been deleted', res);
        showPopup(popupStates.SUCCESS, 'Product deleted from list!');
        triggerInventoryFetch();
      })
      .catch((error) => {
        console.log(error);
        showPopup(popupStates.ERROR, error.message);
      });
  };

  const editProduct = (id) => {
    router.push(`/products/${id}/edit`);
  };

  return (
    <main>
      <section>
        <div className={styles.top_container}>
          <h2 className="section-header">Inventory</h2>
          <Button onClick={() => router.push('/products/new')}>
            New Product
          </Button>
        </div>
        <Separator />
        <div className={styles.gridContainer}>
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
                  onClick={() => editProduct(product.id)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => deleteProduct(e, product)}
                  className={styles.actionButton}
                >
                  Delete
                </button>
              </CardBottom>
            </ShadedCard>
          ))}
        </div>
        {products && products.length === 0 && (
          <div className={styles.emptyPageContainer}>
            <Image src={emptyBox} alt="empty box" />
            <p>No item in inventory</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default InventoryPage;
