import React from 'react';
import Image from 'next/image';
import styles from './Inventory.module.css';
import { ShadedCard } from '@/components/organisms/shadedCard/ShadedCard';
import { CardTop } from '@/components/organisms/cardTop/CardTop';
import { CardBottom } from '@/components/organisms/cardBottom/CardBottom';
import Separator from '@/components/atoms/separator/Separator';
import emptyBox from '@/assets/emptyBox.svg';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button/Button';
// import { useInventory } from '@/hooks/useInventory';
import { products } from '@/seeds/products';

const InventoryPage = () => {
  const router = useRouter();
  // const { products } = useInventory();

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
        {products && products.length > 0 && (
          <div className={styles.gridContainer}>
            {products.map((order) => (
              <ShadedCard key={order.id}>
                <CardTop {...order}></CardTop>
                <CardBottom className={styles.cardBottom}>
                  <div className={styles.col}>
                    <h4>Sold</h4>
                    <p>{order.sold}</p>
                  </div>
                  <div className={styles.col}>
                    <h4>Remain</h4>
                    <p>{order.total_quantity - order.sold}</p>
                  </div>
                  <button className={styles.actionButton}>Edit</button>
                </CardBottom>
              </ShadedCard>
            ))}
          </div>
        )}
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
