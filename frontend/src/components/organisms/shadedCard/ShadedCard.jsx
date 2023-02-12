import React from 'react'
import styles from "./ShadedCard.module.css"

export const ShadedCard = ({children}) => {
  return (
    <article className={styles.shadedCard}>
      {children}
    </article>
  )
}
