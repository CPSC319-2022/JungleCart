// import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './UserCard.module.css';
import { Button } from '@/components/atoms/button/Button';
import userIcon from '@/assets/user-icon.png';
import { fetcher } from "@/lib/api";
import { useUserContext } from '../../../contexts/UserContext';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { useUser } from '@/hooks/useUser';

// img is also needed for the Image component
export const UserCard = ({ user_id }) => {
  const router = useRouter();
  
  const {user, triggerUserFetch} = useUser(user_id);
  // const { showPopup } = usePopupContext();
  const { user: currUser } = useUserContext();
  const { showPopup } = usePopupContext();
  
  if (!user) {
    return <div></div>;
  }

  const makeUserAdmin = () => {
    console.log(currUser)
    fetcher({
      url: `/admins/${currUser?.id}?user_id=${currUser.id}`,
      method: 'PUT',
      token: currUser.accessToken,
      body: {
        is_admin: 1,
      },
    }).then((res) => {
      console.log('User promoted to admin', res);
      showPopup(popupStates.SUCCESS, 'User promoted to admin');
      triggerUserFetch();
      // setTimeout(() => {
      //   router.push('/admin')
      // }, 500)
    }).catch((error) => {
          console.log(error);
          triggerUserFetch();
          //showPopup(popupStates.ERROR, error.message); // TODO fix popping up for 
        });                                               // ordinary users
  };

  const makeUserNotAdmin = () => {
    
    fetcher({
      url: `/admins/${currUser?.id}?user_id=${currUser.id}`,
      method: 'PUT',
      token: currUser.accessToken,
      body: {
        is_admin: 0,
      },
    }).then((res) => {
      console.log('User demoted from admin', res);
      showPopup(popupStates.SUCCESS, 'User demoted from admin');
      triggerUserFetch();
      // setTimeout(() => {
      //   router.push('/admin')
      // }, 500)
    }).catch((error) => {
          console.log(error);
          triggerUserFetch();
          //showPopup(popupStates.ERROR, error.message); // TODO fix popping up for 
        });                                               // ordinary users
  };

  const removeUser = () => {
    console.log(currUser)
    fetcher({
      url: `/admins/${currUser?.id}/users/${currUser.id}`,
      method: 'DELETE',
      token: user.accessToken,
    }).then((res) => {
      console.log('User deleted', res);
      showPopup(popupStates.SUCCESS, 'User deleted!');
      setTimeout(() => {
        router.push('/admin')
      }, 500)
    }).catch((error) => {
          console.log(error);
          // showPopup(popupStates.ERROR, error.message); // TODO fix popping up for ordinary
        });                                               // users
  };
  

  return (
    <div className={`${styles.card} flex flex-wrap justify-between gap-6`}>
      <div className="rounded-full p-7 bg-gray-medium-light">
        <Image src={userIcon} alt="" width={50} />
      </div>
      <div className="grow flex gap-3 shrink-0 flex-nowrap">
        <div>
          <div className="flex gap-2">
            <h1 className="text-2xl font-semibold">Profile</h1>
            {currUser.is_admin == 1 && (
              <div className="font-bold text-primary">Admin</div>
            )}
          </div>
          <p className="leading-6">First Name: {user?.first_name}</p>
          <p className="leading-6">Last Name: {user?.last_name}</p>
          <p className="leading-6">Email address: {user?.email}</p>
        </div>
      </div>
      <div className="flex flex-col justify-around min-h-[6em] grow">
        <Button onClick={() => removeUser()} variant={'error'} className="">
          Remove User
        </Button>
        {user && user.is_admin == 0 && 
          <Button onClick={() => {makeUserAdmin()}}>Make user Admin</Button>
        }
        {user && user.is_admin == 1 && 
          <Button onClick={() => {makeUserNotAdmin()}}>Demote Admin</Button>
        }
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
