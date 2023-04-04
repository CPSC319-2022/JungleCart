import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Profile.module.css';
import Separator from '@/components/atoms/separator/Separator';
import EditIcon from '../../../public/edit_green.svg';
import { Pulser } from '@/components/atoms/pulser/Pulser';
// import { addresses } from '@/seeds/addresses.js';
// import { user_payments } from '@/seeds/payments';
// import { users } from '@/seeds/users';
import CreditIcon from '@/assets/credit.svg';
import EditPaymentModal from '@/components/organisms/modals/EditPaymentModal';
import EditProfileModal from '@/components/organisms/modals/EditProfileModal';
import AddPaymentModal from '@/components/organisms/modals/AddPaymentModal';
import { fetcher } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';
import { AddressPick } from '@/components/organisms/addressPick/addressPick';
import { usePayment } from '@/hooks/usePayment';
import { departmentIdMap } from '@/seeds/departmentIdMap';
import { useRemainingCheckoutTime } from '@/hooks/useRemainingCheckoutTime';
import { formatTime } from '@/lib/helpers';

const Profile = () => {
  const { user: userContext, validateUser } = useUserContext();
  const [user, setUser] = useState();

  const { payment, loading, triggerFetch: triggerPaymentFetch } = usePayment();
  const { remainingCheckoutTime } = useRemainingCheckoutTime();

  useEffect(() => {
    setUser(userContext);
  }, [userContext]);

  const onEditProfileSubmit = (firstname, lastname, department_id) => {
    console.log(firstname, lastname, department_id);
    fetcher({
      url: `/users/${user.id}`,
      method: 'PUT',
      body: {
        user: {
          first_name: firstname,
          last_name: lastname,
          department_id: Number(department_id),
        },
      },
    }).then((res) => {
      console.log(res);
      validateUser(user.accessToken);
    });
  };

  const onAddPaymentSubmit = (
    card_num,
    expiration_date,
    first_name,
    last_name
  ) => {
    console.log(card_num, expiration_date, first_name, last_name);
    fetcher({
      url: `/users/${user.id}/payments`,
      method: 'POST',
      body: {
        payment: {
          is_paypal: 0,
          paypal_id: null,
          is_credit: 1,
          bank_name: 'Bank Name',
          card_num,
          expiration_date,
          first_name,
          last_name,
        },
      },
    }).then(() => triggerPaymentFetch());
  };

  const onEditPaymentSubmit = (
    card_num,
    expiration_date,
    first_name,
    last_name
  ) => {
    console.log(card_num, expiration_date, first_name, last_name);
    fetcher({
      url: `/users/${user.id}/payments/${payment.id}`,
      method: 'PUT',
      body: {
        payment: {
          is_paypal: 0,
          paypal_id: null,
          is_credit: 1,
          bank_name: 'Bank Name',
          card_num,
          expiration_date,
          first_name,
          last_name,
        },
      },
    }).then(() => triggerPaymentFetch());
  };

  return (
    <main>
      <section className="mt-10">
        <div className={`${styles.profile_container}`}>
          <div className={`pb-8 ${styles.card} ${styles.user_card}`}>
            <h1 className="text-2xl font-semibold">Manage account</h1>
            <p>Welcome to the jungle 🦍</p>
          </div>
          <div className={`${styles.card} ${styles.user_card} pb-4`}>
            <h1 className="text-2xl font-semibold">Your Profile</h1>
            <p className="leading-6">First Name: {user?.firstName}</p>
            <p className="leading-6">Last Name: {user?.lastName}</p>
            <p className="leading-6">
              Department: {departmentIdMap[user?.departmentId]}
            </p>
            <p className="leading-6">Email address: {user?.email}</p>
            <button className={styles.edit_button}>
              <label htmlFor="edit-profile" className="cursor-pointer">
                <Image src={EditIcon} alt="edit" />
              </label>
            </button>
          </div>
        </div>
      </section>
      {remainingCheckoutTime > 0 && (
        <div className={styles.pendingOrderContainer}>
          <p>
            You have a pending order that expires in{' '}
            {formatTime(remainingCheckoutTime)}
          </p>
          <Link href="/checkout">Return to checkout</Link>
        </div>
      )}
      <AddressPick />
      <section>
        <div className="section-header">Payments</div>
        <Separator />
        {loading && (
          <main>
            <section>
              <Pulser />
            </section>
          </main>
        )}

        {payment?.id > 0 ? (
          <div className={styles.bottom_container}>
            <div key={payment.id} className={styles.profile_content_card}>
              <div className={styles.image_container}>
                <Image src={CreditIcon} alt="" />
              </div>
              <div className="grow ">
                <div className="font-bold">{payment.card_num}</div>
                <div>{payment.expiration_date}</div>
                <div>
                  {payment.first_name} {payment.last_name}
                </div>
                <div className="flex justify-right">
                  <label htmlFor="edit-payment">
                    <div className="font-bold text-warning cursor-pointer">
                      Edit
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="w-full flex flex-col items-center">
              Oh no! You do not have a payment method!
              <label
                htmlFor="add-payment"
                className={`${styles.bgprimary} cursor-pointer rounded-xl pl-5 pr-5 flex justify-center items-center text-white`}
              >
                Add
              </label>
            </div>
          )
        )}
      </section>

      {/* <label htmlFor="my-modal-4" className="btn">open modal</label> */}
      <EditProfileModal
        initialFirstName={user?.firstName}
        initialLastName={user?.lastName}
        initialDepartmentId={user?.departmentId}
        onSubmit={onEditProfileSubmit}
      />

      <AddPaymentModal onSubmit={onAddPaymentSubmit} />
      <EditPaymentModal
        initialPayment={payment?.id ? payment : {}}
        onSubmit={onEditPaymentSubmit}
      />
    </main>
  );
};

export default Profile;
