import React from 'react';
import styles from './Button.module.css';

export const Button = ({ children, variant, className, ...props }) => {
  const variantTypes = ["primary", "secondary", "error"]
  const buttonVariant = variantTypes.includes(variant) ? variant : "primary"
  return (
    <button className={`${styles.button} ${styles[buttonVariant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
