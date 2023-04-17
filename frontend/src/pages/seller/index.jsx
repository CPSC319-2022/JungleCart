import React from 'react';
import Image from 'next/image';
import styles from './Seller.module.css';
import Separator from '@/components/atoms/separator/Separator';
import { Pulser } from '@/components/atoms/pulser/Pulser';
import { useRouter } from 'next/router';
import { useUserContext } from '@/contexts/UserContext';
import OrdersTableSeller from '@/components/organisms/ordersTableSeller/OrdersTableSeller';
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
            <div className={"flex gap-x-2 py-1 items-center"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" className="inline-block w-8 h-8 ">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <p className={"text-xs "}>Analytics panel is not part of our MVP, but we have plans to implement this to allow better user insight </p>
            </div>
            <Pulser />
          </div>
          
        </div>
      </section>
      <section>
        <h2 className="section-header">Orders</h2>
        <Separator />
        <OrdersTableSeller user_id={user.id}/>
      </section>
    </main>
  );
};

// SellerDashboard.noLayout = true;

export default SellerDashboard;
