import React from 'react'
import styles from './Button.module.css'

export const Button = ({children, variant, ...props}) => {
  const buttonVariant = variant === "secondary" ? variant : "primary";
  return (
    <button className={`${styles.button} ${styles[buttonVariant]}`} {...props}>{children}</button>
  )
}
