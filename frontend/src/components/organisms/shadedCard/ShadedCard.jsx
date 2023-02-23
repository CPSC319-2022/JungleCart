import React from 'react';
import styles from './ShadedCard.module.css';

export const ShadedCard = ({ children, className }) => {
  return (
    <article className={`${styles.shadedCard} ${className ? className : ''}`}>
      {children}
    </article>
  );
};
