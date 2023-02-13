import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/atoms/button/Button';
import styles from "../../../styles/ProductDetails.module.css";
import Image from 'next/image';
import crayon from "../../../assets/crayon.jpg"
// import Navbar from '@/layouts/navbar/Navbar';  // this seemed to be added to the page by default

export default function ProductDetails(img, className) {
const router = useRouter()
  
  return (
 <><div className={styles.topbar}><button className={Button} onClick={() => router.push('/products')}>Back</button></div>
  <div className={styles.belowbar}><div className={styles.details}><h1>Product 1</h1></div></div>
  <div className={styles.standardbar}>
    <button className={Button} onClick={() => router.push('/products')}>Edit</button>
    <button className={Button} onClick={() => router.push('/products')}>Delete</button>
    </div>
  <article className={`${styles.details} ${className? className : ""}`}>
        <div className={styles.pricebox}><div classname={styles.details}><h2>$12</h2></div></div>
        <Image src={crayon} alt='' />
  <div className={styles.pagebody}><p><div className={styles.details}><h1>Name:</h1></div>
    Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for 
    Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, 
    Back to school, School supplies, Arts and Crafts, Gifting</p>
  <div className={styles.pagebody}><p><div className={styles.details}><h1>Description:</h1></div>Classic Crayola 
    crayons. True hues and intense brightness in a huge variety of colors. 
    Kids’ art tools are double wrapped for extra strength. Includes 96 
    different crayon colors and built-in sharpener. 
    Perfect art tool for arts, crafts and creative fun.</p></div></div>
    </article>
    </>
  )
}
