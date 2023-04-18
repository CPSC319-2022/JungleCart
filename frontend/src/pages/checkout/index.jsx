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
import { usePendingOrder } from '@/hooks/usePendingOrder';

const Checkout = () => {
  const { showPopup } = usePopupContext();
  const { user } = useUserContext();

  const router = useRouter();
  const { data: pendingOrder } = usePendingOrder();
  const { data: addresses, loading: address_loading } = useAddresses();
  
  // const [address_loading, setTest] = useState(true);

  const preferredAddress = addresses?.preferred_address;
  const { payment, loading: payment_loading } = usePayment();

  const cancelCheckout = () => {
    fetcher({ url: `/orders/${pendingOrder.id}`, method: 'DELETE' }).then(
      () => {
        showPopup(popupStates.SUCCESS, 'Order was deleted successfully');
        router.push('/cart');
      }
    );
  };

  const validate = () => {
    if (!preferredAddress || Object.keys(preferredAddress).length === 0) {
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
    <main className={`${styles.container}`}>

      <div className={"rounded-md p-4 flex flex-col text-start  py-2   w-full "}>
      <h1 className={"font-bold text-2xl py-2"}>Order #{pendingOrder?.id} Checkout</h1>
        <p className={"font-medium w-md"}>Your order is now pending and the items on hold. Please review your order information. If you have made a mistake you can click on cancel at the bottom of the page and all your cart items will be restored. Otherwise continue with the order.</p>
    </div>
      <div className={styles.content}>



        <ul className="steps steps-vertical w-full py-1  ">
              <li  className={`w-full max-w-full step w-full text-start justify-start py-1 `}>
                <section className={`${styles.block} rounded-md p-4 flex flex-col text-start border  border-base-200 mt-0 shadow-sm  w-full `}>
                  <div className={"flex flex-row gap-x-3 justify-between"}>
                    <h2>Shipping</h2>
                    <p className={styles.editPrompt}>
                      Edit address in <Link href="/profile">Profile</Link>
                    </p>
                  </div>
<Separator/>
                  <div className={"flex flex-row gap-x-3 justify-between"}>
                    <h3 className={"font-bold"}>Address</h3>
                    { address_loading ? 
                      <div className='w-full flex justify-end animate-pulse'>
                        <div className='space-y-2  w-40 flex flex-col '>
                          <div className="h-4 w-40 bg-base-200 rounded-lg"></div>
                          <div className="h-4 w-32 bg-base-200 rounded-lg"></div>
                          <div className="h-4 w-32 bg-base-200 rounded-lg"></div>
                        </div>
                      </div> 
                    : (preferredAddress && Object.keys(preferredAddress).length !== 0 ? (
                      <section className={`${styles.block}`}>

                        <p>{preferredAddress?.address_line_1}</p>
                        {preferredAddress?.address_line_2 && (
                          <p>{preferredAddress?.address_line_2}</p>
                        )}
                        <p>
                          {preferredAddress?.city}, {preferredAddress?.province},{' '}
                          {preferredAddress?.postal_code}
                        </p>
                      </section>
                    ) : (
                      <div className={styles.block}>
                        <p>You have no preferred address</p>
                        <p className={styles.editPrompt}>
                          Set a preferred address in <Link href="/profile">Profile</Link>{' '}
                          to continue with checkout
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator/>
                  <div className={"card bg-gray-light p-2 rounded-md w-full"}>
                    <div className={"flex gap-x-2 py-1 items-center "}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className={"text-sm"}>
                        We simulate shipping by waiting 60s to mark an order as
                        shipped and then another 60s to mark order as completed.
                      </p>
                    </div>
                  </div>
                </section>
              </li>
          <li  className={`w-full max-w-full step w-full text-start justify-start py-1 `}>
            <section className={`${styles.block} rounded-md p-4 flex flex-col text-start border border-base-200 mt-0 shadow-md w-full `}>
              <div className={"flex flex-row gap-x-3 justify-between"}>
              <h2>Payment</h2>
              <p className={styles.editPrompt}>
                Edit payment in <Link href="/profile">Profile</Link>
              </p>
              </div>
              <Separator/>
              <div className={"flex flex-row gap-x-3 justify-between"}>
              <h3 className={"font-bold"}>Payment Method</h3>
              {payment_loading ?
                <div className='w-full flex justify-end animate-pulse'>
                <div className='space-y-2 w-52 flex flex-col '>
                  <div className="h-4 w-52 bg-base-200 rounded-lg"></div>
                </div>
              </div> 
              : (payment?.card_num ? (
                <div className={styles.block}>
                  <p>
                    With credit card **** **** ****{' '}
                    {payment?.card_num?.substring(12)}
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
              ))}
              </div>

              <Separator/>
              <div className={"flex flex-row gap-x-3 justify-between"}>
                <h3 className={"font-bold"}>Total</h3>
                <p>${pendingOrder?.total}</p>
              </div>
              <Separator/>
              <div className={"card bg-gray-light p-2 rounded-md w-full"}>
                <div className={"flex gap-x-2 py-1 items-center "}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className={"text-sm"}>
                    For orders to be placed you need to have a valid payment method set up in your profile.
                  </p>
                </div>
              </div>

            </section>
          </li>

          <li  className={`w-full max-w-full step w-full text-start justify-start py-1 `}>
            <section className={`${styles.block} rounded-md p-4 flex flex-col text-start border border-base-200 mt-0 shadow-md w-full `}>
              <h2>Tracking and Cancellation</h2>
              <Separator/>
              <p>After a successful order placement your order will be marked as orders and you will receive an email at <span className={"underline font-black text-primary-dark"}>{user.email}</span></p>

              <p>You can cancel your order before your order is <span className={"font-black "}>Shipped</span>. In that timeframe you can cancel your order at{" "}
                <Link className={"font-bold"} href="/orders">/orders</Link></p>
              <Separator/>
              <div className={"card bg-gray-light p-2 rounded-md w-full"}>
                <div className={"flex gap-x-2 py-1 items-center "}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p className={"text-xs "}>When an order is successfully placed, per AWS free-tier restrictions only the verified test accounts provided will receive an email from us.</p>
                </div>

              </div>

            </section>
          </li>

        </ul>


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
