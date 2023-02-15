import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button/Button';
import styles from "../../../styles/ProductDetails.module.css";
import Image from "next/image";
import { products } from '@/seeds/products';
import prodcardstyles from '../../../styles/Products.module.css';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';



export default function ProductDetails({className}) {
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
        <h1>{products.products[3].name}</h1>
          <button className={Button} onClick={() => router.push('/products')}>Edit</button>
          &nbsp;&nbsp;&nbsp;
          <button className={Button} onClick={() => router.push('/products')}>Delete</button>
      </div>
    </div>
     
      <div className={styles.pricebox}>
        <div className={styles.details}>
          <h2>$12</h2>
        </div>
      </div>
      <div className={styles.pagebody}>
      <Image src={products.products[3].img[0]} alt='' width={400} height={300} style={{objectFit: "contain"}} unoptimized={true}/>
          <div className={styles.details}>
            <p>{products.products[3].description}</p>
          </div>
        </div>
    </article>
  )
}
