import React from 'react'
import Image from 'next/image'
import styles from "./ProductCard.module.css"

export const ProductCard = ({img, price, className, name}) => {
  return (
    <article className={`${styles.card} ${className? className : ""}`}>
        <div className={styles.imageContainer}>
            <Image src={img[0]} alt={name} fill style={{objectFit: "contain"}} unoptimized={true} />
        </div>
        <div className={styles.info}>
            <h2>{name}</h2>
            <p>$ {price}</p>
        </div>
    </article>
  )
}
