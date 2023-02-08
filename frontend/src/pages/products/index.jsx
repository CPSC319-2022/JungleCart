import React from 'react';
import styles from '../../styles/Cart.module.css';
import { useRouter } from 'next/router';

const Products = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Product: {id}</p>
}

export default Products

