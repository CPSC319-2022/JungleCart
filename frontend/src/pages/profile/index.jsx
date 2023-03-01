import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/button/Button';
import styles from './Profile.module.css';
import Separator from '@/components/atoms/separator/Separator';
import EditIcon from '../../../public/edit_green.svg';
import HomeIcon from '@/assets/home.svg'
import { addresses } from '@/seeds/addresses.js';
import { user_payments } from '@/seeds/payments';
import CreditIcon from '@/assets/credit.svg'
import OfficeIcon from '@/assets/office.svg'
import { useRouter } from 'next/router';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
// import TransactionTable from '@/components/organisms/transactionTable/TransactionTable';

const Profile = () => {
  const popup = usePopupContext();
  const router = useRouter();

  const [user, setUser] = useState({});
  const [addrs, setAddresses] = useState({})
  const [payments, setPayments] =  useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/1`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
      });
    
    setAddresses(addresses.addresses)
    console.log(addresses)
    setPayments(user_payments)
  }, [addrs]);


  const onGotoCart = () => {
    router.push('/cart');
  };

  const onRemove = () => {
    
  }

  return (
    <main>
      <section>
        <div className={styles.top_container}>
          <h2 className="section-header">Hello, {user?.first_name}</h2>
          <Button onClick={() => onGotoCart()}>Go to Cart</Button>
        </div>
        <Separator />
        <div className={styles.profile_container}>
          <div className={`${styles.card} ${styles.user_card}`}>
            <p>
              {user?.first_name} {user?.last_name}
            </p>
            <p>{user?.email}</p>
            <button className={styles.edit_button}>
              <Image src={EditIcon} alt="edit" />
            </button>
          </div>
        </div>
      </section>
      <section>
        <div className='section-header'>Addresses</div>
        <Separator />
        <div className={styles.bottom_container}>
          <div className={styles.profile_content_card}>
            <div className={styles.default_badge}>default</div>
            <div className={styles.image_container}>
              <Image src={HomeIcon} alt="" />
            </div>
            <div className='grow '>
                <div className='font-bold'>
                  {addrs?.preferred?.recipient}
                </div>
                <div>
                  {addrs?.preferred?.address_line1}
                </div>
                <div>
                  {addrs?.preferred?.address_line2}
                </div>
                <div>
                  {addrs?.preferred?.city}, {addrs?.preferred?.province}, {addrs?.preferred?.postal_code} 
                </div>
                <div className='flex justify-between'>
                    <div className='font-bold text-error'>
                      Remove
                    </div>
                    <div className='font-bold text-warning'>
                      Edit
                    </div>
                </div>
            </div>
          </div>
          {addrs?.others?.map((addr) => {
            return (
            <div key={addr.id} className={styles.profile_content_card}>
              <div className={styles.setdefault}>
                Set default
              </div>
              <div className={styles.image_container}>
                <Image src={OfficeIcon} alt="" />
              </div>
              <div className='grow '>
                  <div className='font-bold'>
                    {addr.recipient}
                  </div>
                  <div>
                    {addr.address_line1}
                  </div>
                  <div>
                    {addr.address_line2}
                  </div>
                  <div>
                    {addr.city}, {addr.province}, {addr.postal_code} 
                  </div>
                  <div className='flex justify-between'>
                      <div onClick={() => onRemove()} className='font-bold text-error'>
                        Remove
                      </div>
                      <div className='font-bold text-warning'>
                        Edit
                      </div>
                  </div>
              </div>
            </div>
            )
          })}
          
        </div>
      </section>
      <section>
        <div className='section-header'>Payments</div>
        <Separator />
        <div className={styles.bottom_container}>
        {payments.map((payment) => {
            return (
            <div key={payment.id} className={styles.profile_content_card}>
              <div className={styles.setdefault}>
                Set default
              </div>
              <div className={styles.image_container}>
                <Image src={CreditIcon} alt="" />
              </div>
              <div className='grow '>
                  <div className='font-bold'>
                    {payment.card_num}
                  </div>
                  <div>
                    {payment.expiration_date}
                  </div>
                  <div>
                    {payment.first_name} {payment.last_name}
                  </div>
                  <div className='flex justify-right'>
                      <div className='font-bold text-warning'>
                        Edit
                      </div>
                  </div>
              </div>
            </div>
            )
          })}
        </div>
      </section>
    </main>
  );
};

export default Profile;
