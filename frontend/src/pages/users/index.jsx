import React from 'react';
import { useRouter } from 'next/router';

const Users = () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>User: {id}</p>;
};

export default Users;
