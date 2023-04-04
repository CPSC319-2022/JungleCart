import { useUserContext } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { useFetch } from './useFetch';

export const useOrders = () => {
  const { user } = useUserContext();
  // const [data, setData] = useState([]);

  const { data, loading, error } = useFetch(`/orders/users/${user.id}`);
  // useEffect(() => {
  //   fetch(
  //     `https://bs1qwjk3hh.execute-api.eu-central-1.amazonaws.com/dev/orders/users/2?order_by=created_at&order_dir=asc`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setData(data));
  // }, []);
  return {
    data,
    // loading,
    // error,
  };
};
