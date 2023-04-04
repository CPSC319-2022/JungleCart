import { useFetch } from './useFetch';

export const useOrders = (user_id) => {

  const { data, loading, error, triggerFetch } = useFetch(`/orders/users/${user_id}`);
  return { orders: data, loading, error, triggerFetch };
};