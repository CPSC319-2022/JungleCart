import React, { useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/button/Button';
import styles from './Seller.module.css';
import Separator from '@/components/atoms/separator/Separator';
import EditIcon from '../../../public/edit_green.svg';
import { useRouter } from 'next/router';
import TransactionTable from '@/components/organisms/transactionTable/TransactionTable';
// import { useUser } from '@/hooks/useUser';
// import { useInventory } from '@/hooks/useInventory';
import { products as seeds } from '@/seeds/products';

const SellerDashboard = () => {
  const router = useRouter();

  // const { user } = useUser();
  const user = undefined;
  const products = seeds.products;
  // const { products } = useInventory();

  const totalProducts = useMemo(() => {
    return products.reduce(
      (total, product) => total + product.total_quantity,
      0
    );
  }, [products]);

  const soldProducts = useMemo(() => {
    return products.reduce((total, product) => total + product.sold, 0);
  }, [products]);

  const onViewStore = () => {
    router.push('/inventory');
  };

  return (
    <main>
      <section>
        <div className={styles.top_container}>
          <h2 className="section-header">Hello, {user?.first_name}</h2>
          <Button onClick={() => onViewStore()}>View Store</Button>
        </div>
        <Separator />
        <div className={styles.bottom_container}>
          <div className={`${styles.card} ${styles.user_card}`}>
            <p>
              {user?.first_name} {user?.last_name}
            </p>
            <p>{user?.email}</p>
            <button className={styles.edit_button}>
              <Image src={EditIcon} alt="edit" />
            </button>
          </div>
          <div className={`${styles.card} ${styles.item_card}`}>
            <div className={styles.justify_between}>
              <div>Total Products</div>
              <div>{totalProducts}</div>
            </div>
            <div className={styles.justify_between}>
              <div>Remaining Items</div>
              <div>{soldProducts}</div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 className="section-header">Transactions</h2>
        <Separator />
        <TransactionTable />
      </section>
    </main>
  );
};

export default SellerDashboard;
