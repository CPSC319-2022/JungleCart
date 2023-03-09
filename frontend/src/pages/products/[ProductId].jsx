import React, { useEffect, useState } from 'react';
import styles from '../../styles/ProductDetails.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from '@/components/atoms/button/Button';
import { products } from '@/seeds/products';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import prodstyles from "./Products.module.css"
  
const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState('');
  const router = useRouter();
  const ProductId = router.query.ProductId;
  

  useEffect(() => {
    if (!router.query?.productId) return;
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${router.query.productId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProduct(data.product);
        return data.product;
      })
      .then((product) => {
        return fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${product.seller_id}`
        );
      })
      .then((response) => response.json())
      .then(({ user }) => {
        setSeller(`${user.first_name} ${user.last_name}`);
      });
  }, [router.query]); 

  const onSubmit = () => {
    router.push("/products")
  }

  return (
    <><article className={styles.detailspage}>
      <section className={styles.details}>
        <div className={styles.topbar}>
          <button onClick={() => onSubmit()}>Back</button>
        </div>
        <div className={styles.belowbar}>

          <h1>{products.products[ProductId].name}</h1>
          <button onClick={() => onSubmit()}>Add to Cart</button>

        </div>

        <div className={styles.pricebox}>
          <h2>$12</h2>
        </div>
        <div className={styles.pagebody}>
          <Image src={products.products[ProductId].img[0]} alt='' width={400} height={300} style={{ objectFit: "contain" }} unoptimized={true} />
          <div className={styles.info}>
            <ul>
              {products.products[ProductId].description.split('. ').map(sentence => <li>{sentence}</li>)}
            </ul>
            <table className={styles.table}>
              <thead>

              </thead>
              <tbody>
                <tr>
                  <td>Shipping</td>
                  <td>Shipped only in BC</td>
                </tr>
                <tr>
                  <td>Seller</td>
                  <td>Product seller id/name</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td> {products.products[ProductId].status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      
          <div className={styles.belowbar}>

            
            <button onClick={() => onSubmit()}>Add to Cart</button>
            &nbsp;&nbsp;&nbsp;
            <button className={Button} onClick={() => onSubmit()}>Edit</button>
            &nbsp;&nbsp;&nbsp;
            <button className={Button} onClick={() => onSubmit()}>Delete</button>
          
          </div>
      </section>
    </article></>
  )



}

export default ProductDetails;
