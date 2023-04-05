import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useOrders = () => {
  const { user } = useUserContext();

  const { data, loading, error } = useFetch(`/orders/users/${user.id}`);
  return {
    data,
    loading,
    error,
  };
};
