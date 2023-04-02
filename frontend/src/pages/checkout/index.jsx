import { Button } from '@/components/atoms/button/Button';
import Separator from '@/components/atoms/separator/Separator';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { usePayment } from '@/hooks/usePayment';
import { useRouter } from 'next/router';
import styles from './checkout.module.css';
import { useUserContext } from '@/contexts/UserContext';
import { fetcher } from '@/lib/api';
import { useEffect } from 'react';
import Link from 'next/link';
import { useCheckoutTimeContext } from '@/contexts/CheckoutTimeContext';
import { FREEZE_TIME } from '@/lib/constants';

const Checkout = () => {
  const { showPopup } = usePopupContext();
  const { user } = useUserContext();
  const { remainingCheckoutTime, setRemainingCheckoutTime } =
    useCheckoutTimeContext();

  const router = useRouter();
  const { data: items } = useCart();
  const totalPrice = items?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const { addresses } = useAddresses();
  const preferredAddress = addresses?.preferred_address;
  const { data: payment } = usePayment();

  const hasPayment = Array.isArray(payment) && payment?.[0]?.card_num;

  useEffect(() => {
    const checkoutTime = window.localStorage.getItem('checkoutTime');
    if (!checkoutTime) {
      router.push('/cart');
      return;
    }
    const diff = Date.now() - checkoutTime;
    if (diff > FREEZE_TIME) {
      router.push('/cart');
      return;
    }
    const interval = setInterval(() => {
      const time = +checkoutTime + FREEZE_TIME - Date.now();
      if (time <= 0) {
        router.push('/cart');
        clearInterval(interval);
        setRemainingCheckoutTime(0);
        localStorage.removeItem('checkoutTime');
        return;
      }
      setRemainingCheckoutTime(Math.floor(time / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = `${timeInSeconds % 60}`.padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const cancelCheckout = () => {
    router.push('/cart');
    setRemainingCheckoutTime(0);
    localStorage.removeItem('checkoutTime');
  };

  const checkout = () => {
    // TODO: Call payment api
    // on success:
    fetcher(`/orders/${user.id}/checkout`, user.accessToken, 'POST')
      .then(() => {
        showPopup(popupStates.SUCCESS, 'Order was placed successfully');
        router.push('/cart');
      })
      .catch((e) => {
        console.log(e);
        showPopup(popupStates.WARNING, 'An error occurred:' + e?.message);
      });
  };

  return (
    <main className={styles.container}>
      <p className={styles.timer}>
        Complete your order in{' '}
        <span className={styles.time}>{formatTime(remainingCheckoutTime)}</span>
      </p>
      <div className={styles.content}>
        <section>
          <h2>Shipping to</h2>
          {preferredAddress ? (
            <div className={styles.block}>
              <p>{preferredAddress?.address_line_1}</p>
              {preferredAddress?.address_line_2 && (
                <p>{preferredAddress?.address_line_2}</p>
              )}
              <p>
                {preferredAddress?.city}, {preferredAddress?.province},{' '}
                {preferredAddress?.postal_code}
              </p>
            </div>
          ) : (
            <div className={styles.block}>
              <p>You have no preferred address</p>
              <p>
                Add one in <Link href="/profile">Profile</Link>
              </p>
            </div>
          )}
        </section>
        <Separator />
        <section>
          <h2>Pay ${totalPrice?.toFixed(2)}</h2>
          {hasPayment ? (
            <div className={styles.block}>
              <p>
                With credit card **** **** ****{' '}
                {payment?.card_num?.substring(12)}
              </p>
            </div>
          ) : (
            <div className={styles.block}>
              <p>You have no payment method</p>
              <p>
                Add one in <Link href="/profile">Profile</Link>
              </p>
            </div>
          )}
        </section>
      </div>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={cancelCheckout}>
          Cancel
        </Button>
        <Button onClick={checkout}>Confirm</Button>
      </div>
    </main>
  );
};

export default Checkout;
