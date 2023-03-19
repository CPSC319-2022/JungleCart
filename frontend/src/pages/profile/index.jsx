import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Profile.module.css';
import Separator from '@/components/atoms/separator/Separator';
import EditIcon from '../../../public/edit_green.svg';
import { addresses } from '@/seeds/addresses.js';
import { user_payments } from '@/seeds/payments';
import { users } from '@/seeds/users';
import CreditIcon from '@/assets/credit.svg';
import EditAddressModal from '@/components/organisms/modals/EditAddressModal';
import EditPaymentModal from '@/components/organisms/modals/EditPaymentModal';
import EditProfileModal from '@/components/organisms/modals/EditProfileModal';
import AddAddressModal from '@/components/organisms/modals/AddAddressModal';
import AddPaymentModal from '@/components/organisms/modals/AddPaymentModal';
import ConfirmationModal from '@/components/organisms/modals/ConfirmationModal';

const Profile = () => {
  // const router = useRouter();

  const [user, setUser] = useState({});
  const [addrs, setAddresses] = useState({});
  const [focus_address, setFocusAddress] = useState({});
  const [payment, setPayments] = useState(null);

  const [show_edit_address_modal, setShowEditAddressModal] = useState(false);
  const [show_confirmation_modal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    // fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/1`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setUser(data.user);
    //   })
    //   .catch((error) => console.log(error));

    setUser(users[0]);
    setAddresses(addresses.addresses);
    setPayments(user_payments[0]);
  }, [addrs]);

  const onAddressRemove = (addr_id) => {
    let addr =
      addrs?.others.filter((addr) => addr.id == addr_id)[0] ?? addrs?.preferred;
    setFocusAddress(addr);
    setShowConfirmationModal(true);
  };

  const onRemoveAddressSubmit = (addr_id) => {
    setShowConfirmationModal(false);
    setFocusAddress({});

    console.log(addr_id);
  };

  const onAddressEdit = (addr_id) => {
    let addr =
      addrs?.others.filter((addr) => addr.id == addr_id)[0] ?? addrs?.preferred;
    setFocusAddress(addr);
    setShowEditAddressModal(true);
  };

  const onAddressEditSubmit = (
    recipient,
    address_line1,
    address_line2,
    city,
    province,
    postal_code
  ) => {
    setShowEditAddressModal(false);
    setFocusAddress({});
    console.log(
      recipient,
      address_line1,
      address_line2,
      city,
      province,
      postal_code
    );
  };

  const setDefaultAddress = (addr_id) => {
    console.log(addr_id);
  };

  const onEditProfileSubmit = (firstname, lastname, email) => {
    console.log(firstname, lastname, email);
  };

  const onAddAddressSubmit = (
    recipient,
    address_line1,
    address_line2,
    city,
    province,
    postal_code
  ) => {
    console.log(
      recipient,
      address_line1,
      address_line2,
      city,
      province,
      postal_code
    );
  };

  const onAddPaymentSubmit = (
    card_num,
    expiration_date,
    first_name,
    last_name
  ) => {
    console.log(card_num, expiration_date, first_name, last_name);
  };

  const onEditPaymentSubmit = (
    card_num,
    expiration_date,
    first_name,
    last_name
  ) => {
    console.log(card_num, expiration_date, first_name, last_name);
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
      <section>
        <div className="flex justify-between">
          <div className="section-header">Addresses</div>
          <label
            htmlFor="add-address"
            className={`${styles.bgprimary} cursor-pointer rounded-xl pl-5 pr-5 flex justify-center items-center text-white`}
          >
            Add
          </label>
        </div>
        <Separator />
        <div className={styles.bottom_container}>
          <div className={styles.profile_content_card}>
            <div className={styles.default_badge}>default</div>
            <div className="grow ">
              <div className="font-bold">{addrs?.preferred?.recipient}</div>
              <div className="leading-6">{addrs?.preferred?.address_line1}</div>
              <div className="leading-6">{addrs?.preferred?.address_line2}</div>
              <div className="leading-6">
                {addrs?.preferred?.city}, {addrs?.preferred?.province},{' '}
                {addrs?.preferred?.postal_code}
              </div>
              <div className="flex justify-between">
                <div
                  onClick={() => onAddressEdit(addrs?.preferred?.id)}
                  className="font-bold text-warning cursor-pointer"
                >
                  Edit
                </div>
                <div
                  onClick={() => onAddressRemove(addrs?.preferred?.id)}
                  className="font-bold text-error cursor-pointer"
                >
                  Remove
                </div>
              </div>
            </div>
          </div>
          {addrs?.others?.map((addr) => {
            return (
              <div key={addr.id} className={styles.profile_content_card}>
                <div
                  className={styles.setdefault}
                  onClick={() => setDefaultAddress(addr.id)}
                >
                  Set default
                </div>
                <div className="grow ">
                  <div className="font-bold">{addr.recipient}</div>
                  <div className="leading-6">{addr.address_line1}</div>
                  <div className="leading-6">{addr.address_line2}</div>
                  <div className="leading-6">
                    {addr.city}, {addr.province}, {addr.postal_code}
                  </div>
                  <div className="flex justify-between">
                    <div
                      onClick={() => onAddressEdit(addr.id)}
                      className="font-bold text-warning cursor-pointer"
                    >
                      Edit
                    </div>
                    <div
                      onClick={() => onAddressRemove(addr.id)}
                      className="font-bold text-error cursor-pointer"
                    >
                      Remove
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <div className="section-header">Payments</div>
        <Separator />

        {payment ? (
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

      <AddAddressModal onSubmit={onAddAddressSubmit} />
      <EditAddressModal
        initialAddress={focus_address}
        show={show_edit_address_modal}
        toggle={() => setShowEditAddressModal(false)}
        onSubmit={onAddressEditSubmit}
      />

      <ConfirmationModal
        show={show_confirmation_modal}
        toggle={() => setShowConfirmationModal(false)}
        onApprove={() => onRemoveAddressSubmit(focus_address?.id)}
      />

      <AddPaymentModal onSubmit={onAddPaymentSubmit} />
      <EditPaymentModal
        initialPayment={payment}
        onSubmit={onEditPaymentSubmit}
      />
    </main>
  );
};

export default Profile;
