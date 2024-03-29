import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useInventory = () => {
  const { user } = useUserContext();

  const { data, loading, error, triggerFetch } = useFetch(
    `/users/${user.id}/seller`
  );
  return {
    products: data?.seller.products,
    loading,
    error,
    triggerInventoryFetch: triggerFetch,
  };
};
