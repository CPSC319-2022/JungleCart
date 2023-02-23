import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/button/Button';
import styles from './Seller.module.css';
import Separator from '@/components/atoms/separator/Separator';
import EditIcon from '../../../public/edit_green.svg';
import { useRouter } from 'next/router';

const SellerDashboard = () => {
  const router = useRouter();

  const [user, setUser] = useState({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/1`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  console.log({ user });

  const onViewStore = () => {
    router.push('/inventory');
  };

  return (
    <main>
      <section>
        <div className={styles.top_container}>
          <h2 className={'sectionHeader '}>User1</h2>
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
              <div>0</div>
            </div>
            <div className={styles.justify_between}>
              <div>Remaining Items</div>
              <div>0</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SellerDashboard;
