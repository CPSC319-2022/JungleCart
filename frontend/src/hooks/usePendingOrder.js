import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const usePendingOrder = () => {
  const { user } = useUserContext();

  const { data, loading, error, triggerFetch } = useFetch(
    `/orders/users/${user.id}`
  );

  return {
    data: data ? data.at(-1) : null,
    loading,
    error,
    triggerFetch,
  };
};
