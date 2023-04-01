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

const Checkout = () => {
  const { showPopup } = usePopupContext();
  const { user } = useUserContext();

  const router = useRouter();
  const { data: items } = useCart();
  const totalPrice = items?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const { addresses } = useAddresses();
  const preferredAddress = addresses?.preferred_address;
  const { data: payment } = usePayment();

  console.log({ items, totalPrice, preferredAddress, payment });

  const checkout = () => {
    // TODO: Call payment api
    // on success:
    fetcher('/orders/1/checkout', user.accessToken, 'POST')
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
      <div className={styles.content}>
        <section>
          <h2>Shipping to</h2>
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
        </section>
        <Separator />
        <section>
          <h2>Pay ${totalPrice?.toFixed(2)}</h2>
          <div className={styles.block}>
            <p>
              With credit card **** **** **** {payment?.card_num.substring(12)}
            </p>
          </div>
        </section>
      </div>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={() => router.push('/cart')}>
          Cancel
        </Button>
        <Button onClick={checkout}>Confirm</Button>
      </div>
    </main>
  );
};

export default Checkout;
