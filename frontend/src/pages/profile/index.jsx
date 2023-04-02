import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Profile.module.css';
import Separator from '@/components/atoms/separator/Separator';
import EditIcon from '../../../public/edit_green.svg';
// import { addresses } from '@/seeds/addresses.js';
// import { user_payments } from '@/seeds/payments';
// import { users } from '@/seeds/users';
import CreditIcon from '@/assets/credit.svg';
import EditPaymentModal from '@/components/organisms/modals/EditPaymentModal';
import EditProfileModal from '@/components/organisms/modals/EditProfileModal';
import AddPaymentModal from '@/components/organisms/modals/AddPaymentModal';
import { useAddresses } from '@/hooks/useAddresses';
import { fetcher } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';
import { AddressPick } from '@/components/organisms/addressPick/addressPick';
import { usePayment } from '@/hooks/usePayment';

const Profile = () => {
  // const router = useRouter();
  const { user } = useUserContext();

  // const [user, setUser] = useState({});
  // const [addrs, setAddresses] = useState({});
  const {payment, loading, error, triggerFetch: triggerPaymentFetch} = usePayment();
  
  useEffect(() => {
    console.log(payment)
  }, [payment]);
  
  const onEditProfileSubmit = (firstname, lastname, email) => {
    console.log(firstname, lastname, email);
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
      method: "POST",
      body: {
        payment: {
          is_paypal: 0,
          paypal_id: null,
          is_credit: 1,
          bank_name: "Bank Name",
          card_num,
          expiration_date,
          first_name,
          last_name
        }
      }
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
      url: `/users/${user.id}/payments/${payment[0].id}`,
      method: "PUT",
      body: {
        payment: {
          is_paypal: 0,
          paypal_id: null,
          is_credit: 1,
          bank_name: "Bank Name",
          card_num,
          expiration_date,
          first_name,
          last_name
        }
      }
    }).then(() => triggerPaymentFetch());
  };

  return (
    <main>
      <section className="mt-10">
        <div className={`${styles.profile_container}`}>
          <div className={`pb-8 ${styles.card} ${styles.user_card}`}>
            <h1 className="text-2xl font-semibold">
              Hello, {user?.first_name}!
            </h1>
            <p>Welcome to the jungle 🦍</p>
          </div>
          <div className={`${styles.card} ${styles.user_card} pb-4`}>
            <h1 className="text-2xl font-semibold">Your Profile</h1>
            <p className="leading-6">First Name: {user?.first_name}</p>
            <p className="leading-6">Last Name: {user?.last_name}</p>
            <p className="leading-6">Email address: {user?.email}</p>
            <button className={styles.edit_button}>
              <label htmlFor="edit-profile" className="cursor-pointer">
                <Image src={EditIcon} alt="edit" />
              </label>
            </button>
          </div>
        </div>
      </section>
      <AddressPick />
      <section>
        <div className="section-header">Payments</div>
        <Separator />

        {payment?.length > 0 ? (
          <div className={styles.bottom_container}>
            <div key={payment[0].id} className={styles.profile_content_card}>
              <div className={styles.image_container}>
                <Image src={CreditIcon} alt="" />
              </div>
              <div className="grow ">
                <div className="font-bold">{payment[0].card_num}</div>
                <div>{payment[0].expiration_date}</div>
                <div>
                  {payment[0].first_name} {payment[0].last_name}
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
          <div className="w-full flex flex-col items-center">
            Oh no! You do not have a payment method!
            <label
              htmlFor="add-payment"
              className={`${styles.bgprimary} cursor-pointer rounded-xl pl-5 pr-5 flex justify-center items-center text-white`}
            >
              Add
            </label>
          </div>
        )}
      </section>

      {/* <label htmlFor="my-modal-4" className="btn">open modal</label> */}
      <EditProfileModal
        initialFirstName={user?.first_name}
        initialLastName={user?.last_name}
        initialEmail={user?.email}
        onSubmit={onEditProfileSubmit}
      />

      <AddPaymentModal onSubmit={onAddPaymentSubmit} />
      <EditPaymentModal
        initialPayment={payment ? payment[0] : {}}
        onSubmit={onEditPaymentSubmit}
      />
    </main>
  );
};

export default Profile;
