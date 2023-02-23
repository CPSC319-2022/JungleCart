import React from 'react';
import styles from './CardBottom.module.css';

export const CardBottom = ({ children, className }) => {
  return (
    <div className={`${styles.cardBottom} ${className ? className : ''}`}>
      {children}
    </div>
  );
};
