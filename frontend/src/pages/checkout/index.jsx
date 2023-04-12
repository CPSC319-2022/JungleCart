import { Button } from '@/components/atoms/button/Button';
import Separator from '@/components/atoms/separator/Separator';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { useAddresses } from '@/hooks/useAddresses';
import { usePayment } from '@/hooks/usePayment';
import { useRouter } from 'next/router';
import styles from './checkout.module.css';
import { useUserContext } from '@/contexts/UserContext';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import warning from '@/assets/warning.svg';
import Image from 'next/image';
import { usePendingOrder } from '@/hooks/usePendingOrder';

const Checkout = () => {
  const { showPopup } = usePopupContext();
  const { user } = useUserContext();

  const router = useRouter();
  const { data: pendingOrder } = usePendingOrder();
  const { data: addresses } = useAddresses();

  const preferredAddress = addresses?.preferred_address;
  const { payment } = usePayment();

  const cancelCheckout = () => {
    fetcher({ url: `/orders/${pendingOrder.id}`, method: 'DELETE' }).then(
      () => {
        showPopup(popupStates.SUCCESS, 'Order was deleted successfully');
        router.push('/cart');
      }
    );
  };

  const validate = () => {
    if (!preferredAddress) {
      showPopup(popupStates.WARNING, 'You have no preferred address');
      return false;
    }
    if (!payment?.card_num) {
      showPopup(popupStates.WARNING, 'You have no payment method');
      return false;
    }
    const [month, year] = payment.expiration_date.split('/');
    const expiryDate = new Date(`20${year}`, month);
    if (expiryDate < new Date()) {
      showPopup(popupStates.WARNING, 'Your card has expired');
      return false;
    }
    return true;
  };

  const checkout = () => {
    if (!validate()) return;
    fetcher({
      url: `/orders/${pendingOrder.id}/process`,
      token: user.accessToken,
      method: 'POST',
      body: {},
    })
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
              <p className={styles.editPrompt}>
                Edit address in <Link href="/profile">Profile</Link>
              </p>
              <div className={styles.infoText}>
                <Image src={warning} alt="warning" width={20} height={20} />
                <p>
                  We simulate shipping by waiting 60s to mark an order as
                  shipped, during which time a user is free to cancel the order
                  at {` `}
                  <Link href="/orders">/orders</Link>. 60s after an order is
                  shipped, it will be marked as completed.
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.block}>
              <p>You have no preferred address</p>
              <p className={styles.editPrompt}>
                Set a preferred address in <Link href="/profile">Profile</Link>{' '}
                to continue with checkout
              </p>
            </div>
          )}
        </section>
        <Separator />
        <section>
          <h2>Pay ${pendingOrder?.total}</h2>
          {payment?.card_num ? (
            <div className={styles.block}>
              <p>
                With credit card **** **** ****{' '}
                {payment?.card_num?.substring(12)}
              </p>
              <p className={styles.editPrompt}>
                Edit payment in <Link href="/profile">Profile</Link>
              </p>
            </div>
          ) : (
            <div className={styles.block}>
              <p>You have no payment method</p>
              <p className={styles.editPrompt}>
                Add a payment method in <Link href="/profile">Profile</Link> to
                continue with checkout
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
