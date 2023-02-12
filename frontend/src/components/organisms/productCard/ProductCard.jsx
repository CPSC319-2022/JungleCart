import React from 'react'
import Image from 'next/image'
import styles from "./ProductCard.module.css"

export const ProductCard = ({img, price, name}) => {
  return (
    <article className={styles.card}>
        <div className={styles.imageContainer}>
            <Image src={img[0]} alt={name} />
        </div>
        <div className={styles.info}>
            <h2>{name}</h2>
            <p>$ {price}</p>
        </div>
    </article>
  )
}
