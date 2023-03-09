import { Button } from '@/components/atoms/button/Button';
import Separator from '@/components/atoms/separator/Separator';
import { useUserContext } from '@/contexts/UserContext';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { usePayment } from '@/hooks/usePayment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './checkout.module.css';

const Checkout = () => {
  const router = useRouter();
  // const { items } = useCart();
  // const totalPrice = items.reduce((total, item) => total + item.price, 0);
  // const { addresses } = useAddresses();
  // const preferredAddress = addresses.preferred_address;
  // const { payment } = usePayment();

  const totalPrice = 15.7;
  const preferredAddress = {
    address_line_1: '2205 Lower Mall',
    city: 'Vancouver',
    province: 'BC',
    postal_code: 'V6T 1Z4',
  };

  const payment = {
    card_num: '1234123412341234',
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <section>
          <h2>Shipping to</h2>
          <div className={styles.block}>
            <p>{preferredAddress.address_line_1}</p>
            {preferredAddress.address_line_2 && (
              <p>{preferredAddress.address_line_2}</p>
            )}
            <p>
              {preferredAddress.city}, {preferredAddress.province},{' '}
              {preferredAddress.postal_code}
            </p>
          </div>
        </section>
        <Separator />
        <section>
          <h2>Pay ${totalPrice}</h2>
          <div className={styles.block}>
            <p>
              With credit card **** **** **** {payment.card_num.substring(12)}
            </p>
          </div>
        </section>
      </div>
      <div className={styles.buttons}>
        <Button variant="secondary">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    </main>
  );
};

export default Checkout;
