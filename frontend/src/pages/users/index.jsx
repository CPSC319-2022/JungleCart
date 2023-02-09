import React from 'react';
import styles from '../../styles/Cart.module.css';
import { useRouter } from 'next/router';

const Users = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>User: {id}</p>
}

export default Users