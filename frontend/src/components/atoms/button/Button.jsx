import React from 'react'
import styles from './Button.module.css'

export const Button = ({children, className}) => {
  return (
    <button className={`${styles.button} ${className? className : ""}`}>{children}</button>
  )
}
