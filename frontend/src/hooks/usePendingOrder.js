import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const usePendingOrder = () => {
  const { user } = useUserContext();

  const { data, loading, error, triggerFetch } = useFetch(
    `/orders/users/${user.id}`
  );

  return {
    data: data ? data.find((order) => order.status_label === 'pending') : null,
    loading,
    error,
    triggerFetch,
  };
};
