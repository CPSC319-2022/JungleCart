import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { useUserContext } from '@/contexts/UserContext';
import { fetcherWithSpinner } from '@/lib/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './ProductCard.module.css';
import GorillaIllustration from '@/assets/gorillas_illustration.png';

// img is also needed for the Image component
export const ProductCard = ({ price, discount, sellerId, name, id, img }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const { showPopup } = usePopupContext();

  const isAuthor = sellerId === user.id;

  const addToCart = async (e) => {
    fetcherWithSpinner(e.target, {
      url: `/carts/${user.id}/items`,
      method: 'POST',
      body: {
        id,
        quantity: 1,
      },
    }).then(() => {
      showPopup(popupStates.SUCCESS, 'Added to cart');
    });
  };

  return (
    <div
      className={`${styles.card} hover:shadow-lg rounded-md shadow-md bg-white`}
    >
      <div className=" relative md:container h-60  p-5">
        <figure>
          {' '}
          <Image
            className=" object-scale-down p-5"
            src={img?.length > 0 ? img[0]?.url : GorillaIllustration}
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
          {discount !== price ? (
            <div className="flex flex-col">
              <span className="text-gray-500 line-through text-sm">
                ${price}
              </span>
              <span className="text-gray-500">${discount}</span>
            </div>
          ) : (
            <span className="text-gray-500">${price}</span>
          )}
          {!isAuthor && (
            <button className={styles.button} onClick={addToCart}>
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
