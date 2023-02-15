import React from 'react'
import styles from "./CardTop.module.css"
import Image from 'next/image'

export const CardTop = ({className, img, price, name}) => {
  return (
    <div className={`${styles.cardTop} ${className? className : ""}`}>
        <div className={styles.imageContainer}>
            <Image src={img} alt={name} fill style={{objectFit: "cover"}} />
        </div>
        <div className={styles.info}>
            <h2>{name}</h2>
            <p>$ {price}</p>
        </div>
    </div>
  )
}
