import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './UserCard.module.css';
import iconUserGreen from '@/assets/Icon-User-green.png';

// img is also needed for the Image component
export const UserCard = ({ email, name, id }) => {
  const router = useRouter();
  const { showPopup } = usePopupContext();

  const deleteUser = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/1`, { method: 'DELETE' }) 
                                                                                // TODO set 
                                                                                // order id
    .then(() => this.setState({ status: 'Delete successful' }))
    .then(() => showPopup( 'User deletion successful' ))
    }
  
  return (
    <div
      className={`${styles.card} hover:shadow-lg rounded-md shadow-md bg-gray-light`}
    >
      <div className=" relative md:container h-60  p-5">
        <figure>
          {' '}
          <Image
            className=" object-scale-down p-5"
            src={iconUserGreen}
            alt={name}
            fill
            onClick={() => router.push(`/admin/viewuser/${id}`)}
          />
        </figure>
      </div>
      <div className={styles.info}>
        <div
          className="tooltip tooltip-closed tooltip-top tooltip-primary text-left"
          data-tip={name}
        >
          <h2 className={styles.title}>{name}</h2>
        </div>
        <div className="w-full flex justify-between">
          <p className={'text-sm font-bold'}>${price}</p>
          <button className={styles.button} onClick={deleteUser}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
