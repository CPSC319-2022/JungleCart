import React from 'react'
import styles from "./CardTop.module.css"
import Image from 'next/image'

export const CardTop = ({children, img, price, name}) => {
  return (
    <div className={styles.cardTop}>
        <div className={styles.imageContainer}>
            <Image src={img[0]} alt={name} />
        </div>
        <div className={styles.info}>
            <h2>{name}</h2>
            <p>$ {price}</p>
        </div>
    </div>
  )
}
