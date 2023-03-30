// import React, { useEffect } from 'react';
import styles from './CardTop.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

export const CardTop = ({ className, id, img, price, name }) => {
  const router = useRouter();
  const navigateToProduct = () => {
    router.push(`/products/${id}`);
  };

  return (
    <div className={`${styles.cardTop} ${className ? className : ''}`}>
      <div className={styles.imageContainer}>
        <Image
          onClick={navigateToProduct}
          src={img}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.info}>
        <h2 onClick={navigateToProduct}>{name}</h2>
        <p>$ {price}</p>
      </div>
    </div>
  );
};
