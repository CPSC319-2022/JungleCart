import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useCart = () => {
  const { user } = useUserContext();

  const { data, loading, error } = useFetch(`/carts/${user.id}/items`);
  return { data: data?.cart?.[0].products, loading, error };
};
