import React from 'react'
import styles from "./CardTop.module.css"
import Image from 'next/image'
import { useRouter } from 'next/router'

export const CardTop = ({id, className, img, price, name}) => {
  const router = useRouter();

  return (
    <div className={`${styles.cardTop} ${className? className : ""}`}>
        <div className={styles.imageContainer}>
            <Image src={img} alt={name} fill style={{objectFit: "cover"}} 
            onClick={() =>router.push(`/products/${id}`)}/>
        </div>
        <div className={styles.info}>
            <h2>{name}</h2>
            <p>$ {price}</p>
        </div>
    </div>
  )
}
