import React from 'react'
import Image from 'next/image'
import styles from "./ProductCard.module.css"
import { useRouter } from 'next/router'

export const ProductCard = ({img, price, className, name, id}) => {
  const router = useRouter();

  return (
    <article className={`${styles.card} ${className? className : ""}`}>
        <div className={styles.imageContainer} onClick={() => router.push({
                      pathname: '/products/',
                      query: { id: id  }
                      })}
          >
            <Image src={img[0]} alt={name} fill style={{objectFit: "cover"}} onClick={() => router.push(`/products/${id}`)}/>
        </div>
        <div className={styles.info}>
            <h2>{name}</h2>
            <p>$ {price}</p>
        </div>
    </article>
  )
}
