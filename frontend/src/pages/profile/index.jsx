import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/atoms/button/Button';
import styles from './Profile.module.css';
import Separator from '@/components/atoms/separator/Separator';
import EditIcon from '../../../public/edit_green.svg';
import HomeIcon from '@/assets/home.svg'
import { addresses } from '@/seeds/addresses.js';
import { user_payments } from '@/seeds/payments';
import { users } from '@/seeds/users';
import CreditIcon from '@/assets/credit.svg'
import OfficeIcon from '@/assets/office.svg'
import { useRouter } from 'next/router';
// import TransactionTable from '@/components/organisms/transactionTable/TransactionTable';

const Profile = () => {
  const router = useRouter();

  const [user, setUser] = useState({});
  const [addrs, setAddresses] = useState({})
  const [payments, setPayments] =  useState([])

  useEffect(() => {
    // fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/1`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setUser(data.user);
    //   })
    //   .catch((error) => console.log(error));
  
    setUser(users[0])
    setAddresses(addresses.addresses)
    console.log(addresses)
    setPayments(user_payments)
  }, [addrs]);


  const onGotoCart = () => {
    router.push('/cart');
  };

  const onRemove = () => {
    
  }

  const onSubmit = (firstname, lastname, email) => {
    console.log(firstname, lastname, email)
  }


  return (
    <main>
      <section className="mt-10">
        <div className={`${styles.profile_container}`}>
          <div className={`pb-8 ${styles.card} ${styles.user_card}`}>
            <h1 className='text-2xl font-semibold'>Hello, {user?.first_name}!</h1>
            <p>Welcome to the jungle 🦍</p>
          </div>
          <div className={`${styles.card} ${styles.user_card} pb-4`}>
            <h1 className='text-2xl font-semibold'>Your Profile</h1>
            <p className="leading-6">First Name: {user?.first_name}</p>
            <p className="leading-6">Last Name: {user?.last_name}</p>
            <p className="leading-6">Email address: {user?.email}</p>
              <button className={styles.edit_button}>
                <label htmlFor='edit-profile' className='cursor-pointer'>
                  <Image src={EditIcon} alt="edit" />
                </label>
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

      {/* <label htmlFor="my-modal-4" className="btn">open modal</label> */}
      <EditProfileModal
      initialFirstName={user?.first_name} initialLastName={user?.last_name}
      initialEmail={user?.email} onSubmit={onSubmit} />

    </main>
  );
};

const EditProfileModal = ({initialFirstName, initialLastName,
                           initialEmail, onSubmit}) => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
      setEmail(initialEmail)
      setFirstName(initialFirstName)
      setLastName(initialLastName)
    }, [initialFirstName, initialLastName, initialEmail])

    const handleFirstNameChange = (e) => {
      setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
      setLastName(e.target.value);
    }

    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    }

    const onSubmitClick = () => {
      if(changed()){
        onSubmit(first_name, last_name, email)
      }
    }

    const changed = () => {
      return first_name !== initialFirstName ||
              last_name !== initialLastName ||
              email !== initialLastName
    }

    return (
      <>
      <input type="checkbox" id="edit-profile" className="modal-toggle cursor-pointer" />
      <label htmlFor="edit-profile" className="modal ">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Edit Profile</h3>
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input type="text" value={first_name} className='input input-bordered w-full' onChange={handleFirstNameChange}></input>
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input type="text" value={last_name} className='input input-bordered w-full' onChange={handleLastNameChange}></input>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="text" value={email} className='input input-bordered w-full' onChange={handleEmailChange}></input>
          <div className="modal-action">
            <label htmlFor="edit-profile" className='btn border-none bg-primary-dark text-white' 
            onClick={() => onSubmitClick()} >Submit</label>
          </div>
        </label>
      </label>
      </>
    )
}

export default Profile;
