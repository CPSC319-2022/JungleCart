import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useOrders = () => {
  const { user } = useUserContext();

  const { data, loading, error, triggerFetch } = useFetch(`/orders/users/${user.id}`);
  return { orders: data, loading, error, triggerFetch };
};