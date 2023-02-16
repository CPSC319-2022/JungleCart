import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button/Button';
import styles from "../../styles/ProductDetails.module.css";
import Image from "next/image";
import { products } from '@/seeds/products';
import prodcardstyles from '../../styles/Products.module.css';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';



export default function ProductDetails({className}) {
  const router = useRouter()
  const ProductId = router.query.ProductId;
  const onSubmit = () => {
    router.back();
  }  
  if (!ProductId) {
    return <div></div>
  }

  return (
  <article className={styles.detailspage}>
   <section className={styles.details}>
    <div className={styles.topbar}>
      <button onClick={() => onSubmit()}>Back</button>
    </div>
    <div className={styles.belowbar}>
    
        <h1>{products.products[ProductId].name}</h1>
        <button onClick={() => onSubmit()}>Add to Cart</button>
          {/* <button className={Button} onClick={() => onSubmit()}>Edit</button>
          &nbsp;&nbsp;&nbsp;
          <button className={Button} onClick={() => onSubmit()}>Delete</button> */}
       
    </div>
     
      <div className={styles.pricebox}>
          <h2>$12</h2>
      </div>
      <div className={styles.pagebody}>
      <Image src={products.products[ProductId].img[0]} alt='' width={400} height={300} style={{objectFit: "contain"}} unoptimized={true}/>
          <div className={styles.info} >
            <ul>
          {products.products[ProductId].description.split('. ').map(sentence =>  <li>{sentence}</li> )}
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
        
        </section>
       </article> 
  )
}
