import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './ProductCard.module.css';

// img is also needed for the Image component
export const ProductCard = ({ price, name, id }) => {
  const router = useRouter();

  const addToCart = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/1/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        // TODO: Add a toast to show the user that the product was added to the cart
        console.log('Success:', { data });
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
