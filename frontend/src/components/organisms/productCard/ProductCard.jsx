import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { useUserContext } from '@/contexts/UserContext';
import { fetcher } from '@/lib/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './ProductCard.module.css';

// img is also needed for the Image component
export const ProductCard = ({ price, name, id }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { showPopup } = usePopupContext();

  const addToCart = async () => {
    fetcher('/carts/1/items', user?.accessToken, 'POST', {
      productId: id,
    }).then(() => {
      showPopup(popupStates.SUCCESS, 'Added to cart');
    });
  };

  return (
    <div
      className={`${styles.card} hover:shadow-lg rounded-md shadow-md bg-gray-light`}
    >
      <div className=" relative md:container h-60  p-5">
        <figure>
          {' '}
          <Image
            className=" object-scale-down p-5"
            src="https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg"
            alt={name}
            fill
            onClick={() => router.push(`/products/${id}`)}
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
          <button className={styles.button} onClick={addToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
