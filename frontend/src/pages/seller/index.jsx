import React from 'react';
import Image from 'next/image';
import styles from './Seller.module.css';
import Separator from '@/components/atoms/separator/Separator';
import { Pulser } from '@/components/atoms/pulser/Pulser';
import { useRouter } from 'next/router';
import { useUserContext } from '@/contexts/UserContext';
import OrdersTable from '@/components/organisms/ordersTable/OrdersTable';
import GorillaIllustration from'@/assets/gorillas_illustration.png'

const SellerDashboard = () => {
  const router = useRouter();
  const { user } = useUserContext();

  const onViewStore = () => {
    router.push('/inventory');
  };

  return (
    <main>
      <section>
        <div className={styles.bottom_container}>
          <div className="card w-96 shadow-xl image-full">
            <figure><Image src={GorillaIllustration} alt="Shoes" fill className='rounded-xl'/></figure>
            <div className="card-body">
              <h2 className="card-title">Hello Seller!</h2>
              <p>Streamline Your Selling Experience with Your All-In-One Seller Dashboard</p>
              <div className="card-actions justify-end">
                <button onClick={() => onViewStore()} className="btn btn-primary">View Store</button>
              </div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.user_card}`}>
            <h2 className='font-bold text-2xl'>Analytics</h2>
            <Pulser />
          </div>
          
        </div>
      </section>
      <section>
        <h2 className="section-header">Orders</h2>
        <Separator />
        <OrdersTable user_id={user.id} />
      </section>
    </main>
  );
};

// SellerDashboard.noLayout = true;

export default SellerDashboard;
