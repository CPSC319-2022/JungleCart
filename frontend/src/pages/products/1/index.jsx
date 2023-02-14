import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button/Button';
import styles from "../../../styles/ProductDetails.module.css";
import Image from "next/image";
import { products } from '@/seeds/products';



export default function ProductDetails({img, className}) {
  const router = useRouter()
  const onSubmit = () => {
    router.push('/products');
  }  
  return (
  <article className={`${styles.details} ${className? className : ""}`}>
    <div className={styles.topbar}>
      <button onClick={() => onSubmit()}>Back</button>
    </div>
    <div className={styles.belowbar}>
      <div className={styles.details}>
      <h1>Product 1</h1>
    </div>
      </div>
      <button className={Button} onClick={() => router.push('/products')}>Edit</button>
      &nbsp;&nbsp;&nbsp;
      <button className={Button} onClick={() => router.push('/products')}>Delete</button>
      <div className={styles.pricebox}>
        <div classname={styles.details}>
          <h2>$12</h2>
        </div>
      </div>
      <Image src={products.products[0].img[0]} alt='' width={400} height={300} style={{objectFit: "contain"}} unoptimized={true}/>
        <div className={styles.pagebody}>
          <div className={styles.details}>
            <h1>Name:</h1>
            <p>{products.products[0].name}</p>
          </div>
        </div>
        <div className={styles.pagebody}>
          <div className={styles.details}>
            <h1>Description:</h1>
            <p>{products.products[0].description}</p>
          </div>
        </div>
    </article>
  )
}
