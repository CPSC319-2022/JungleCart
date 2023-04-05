import { useEffect, useState } from 'react';
import styles from './ProductDetails.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from '@/components/atoms/button/Button';
import { fetcher } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import GorillaIllustration from '@/assets/gorillas_illustration.png';


const ProductDetails = () => {
  const { user } = useUserContext();
  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState({});
  const { showPopup } = usePopupContext();
  const router = useRouter();

  const isAuthor = product.sellerId === user.id;
  const productId = router.query.productId;

  useEffect(() => {
    if (!router.query?.productId) return;
    fetcher({ url: `/products/${router.query.productId}` })
      .then((data) => {
        setProduct(data);
        console.log(data);
        return data;
      })
      .then((product) => {
        return fetcher({ url: `/users/${product.sellerId}` });
      })
      .then((sellerData) => {
        setSeller(sellerData.user);
      });
  }, [router.query]);

  const onSubmit = () => {
    router.back();
  };

  const deleteProduct = () => {
    if (!isAuthor) return;
    fetcher({
      url: `/products/${router.query.productId}`,
      method: 'DELETE',
    }).then(() => {
      router.push('/products');
    });
  };

  const addToCart = () => {
    if (isAuthor) return;
    fetcher({
      url: `/carts/${user.id}/items`,
      method: 'POST',
      body: {
        id: product.id,
        quantity: 1,
      },
    }).then(() => showPopup(popupStates.SUCCESS, 'Added to cart!'));
  };

  const editProduct = () => {
    if (!isAuthor) return;
    router.push(`/products/${productId}/edit`);
  };

  const getProductStatus = (id) => {
    if (id === 1) return 'In Stock';
    else return 'Out of Stock';
  };

  if (!productId || !product) {
    return <div></div>;
  }

  return (
    <article className={styles.detailspage}>
      <section className={`${styles.details} shadow-lg`}>
        <div className={styles.topbar}>
          <button onClick={() => onSubmit()}>Back</button>
        </div>
        <div className={styles.formatting}>
          <header>
            <h1>{product.name}</h1>
            {product.discount !== product.price ? (
              <div className={styles.priceContainer}>
                <p className={styles.originalPrice}>${product.price}</p>
                <p>${product.discount}</p>
              </div>
            ) : (
              <div className={styles.priceContainer}>
                <p>${product.price}</p>
              </div>
            )}
          </header>
          <div className={styles.belowbar}>
            {isAuthor ? (
              <>
                <button className={Button} onClick={editProduct}>
                  Edit
                </button>
                &nbsp;&nbsp;&nbsp;
                <button className={Button} onClick={deleteProduct}>
                  Delete
                </button>
              </>
            ) : (
              <button onClick={addToCart}>Add to Cart</button>
            )}
          </div>
        </div>

        <div className={styles.pricebox}></div>
        <div className={styles.pagebody}>
          <Image
            src={
              product.img?.length > 0
                ? product.img?.[0]?.url
                : GorillaIllustration
            }
            alt=""
            width={400}
            height={300}
            style={{ objectFit: 'contain' }}
            unoptimized={true}
          />
          <div className={styles.info}>
            <table className={styles.table}>
              <thead></thead>
              <tbody>
                <tr>
                  <td>Shipping</td>
                  <td>Shipped only in BC</td>
                </tr>
                <tr>
                  <td>Seller</td>
                  <td>
                    {seller.first_name} {seller.last_name}
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td> {getProductStatus(product.productStatusId)}</td>
                </tr>
              </tbody>
            </table>
            <ul className="mt-5">
              {product.description?.split('. ').map((sentence, index) => (
                <li key={index}>{sentence}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
};

export default ProductDetails;
