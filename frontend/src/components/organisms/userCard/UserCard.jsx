// import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import Image from 'next/image';
// import { useRouter } from 'next/router';
import styles from './UserCard.module.css';
import { Button } from '@/components/atoms/button/Button';
import userIcon from '@/assets/user-icon.png';

// img is also needed for the Image component
export const UserCard = ({ user }) => {
  // const router = useRouter();
  // const { showPopup } = usePopupContext();

  // const deleteUser = async () => {
  //   fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/1`, { method: 'DELETE' })
  //                                                                               // TODO set
  //                                                                               // order id
  //   .then(() => this.setState({ status: 'Delete successful' }))
  //   .then(() => showPopup( popupStates.SUCCESS, 'User deletion successful' ))
  //   }
  if (!user) {
    return <div></div>;
  }

  return (
    <div className={`${styles.card} flex flex-wrap justify-between gap-6`}>
      <div className="rounded-full p-7 bg-gray-medium-light">
        <Image src={userIcon} alt="" width={50} />
      </div>
      <div className="grow flex gap-3 shrink-0 flex-nowrap">
        <div>
          <div className="flex gap-2">
            <h1 className="text-2xl font-semibold">Profile</h1>
            {user.is_admin == 1 && (
              <div className="font-bold text-primary">Admin</div>
            )}
          </div>
          <p className="leading-6">First Name: {user?.first_name}</p>
          <p className="leading-6">Last Name: {user?.last_name}</p>
          <p className="leading-6">Email address: {user?.email}</p>
        </div>
      </div>
      <div className="flex flex-col justify-around min-h-[6em] grow">
        <Button variant={'error'} className="">
          Remove User
        </Button>
        <Button>Make user Admin</Button>
      </div>
    </div>
  );

  // return (
  //   <div
  //     className={`${styles.card} hover:shadow-lg rounded-md shadow-md bg-gray-light`}
  //   >
  //     <div className=" relative md:container h-60  p-5">
  //       <figure>
  //         {' '}
  //         <Image
  //           className=" object-scale-down p-5"
  //           src={iconUserGreen}
  //           alt={name}
  //           fill
  //         />
  //       </figure>
  //     </div>
  //     <div className={styles.info}>
  //       <div
  //         className="tooltip tooltip-closed tooltip-top tooltip-primary text-left"
  //         data-tip={name}
  //       >
  //         <h2 className={styles.title}>{name}</h2>
  //       </div>
  //       <div className="w-full flex justify-between">
  //         <p className={'text-sm font-bold'}>{email}</p>
  //         <button className={styles.button} onClick={deleteUser}>
  //           Delete User
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};
