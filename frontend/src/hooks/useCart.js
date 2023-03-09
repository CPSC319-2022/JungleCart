import { useFetch } from './useFetch';

export const useCart = () => {
  const { user } = useUserContext();

  const { data, loading, error } = useFetch(`/carts/${user.id}/items`);
  return { items: data.carts[0].products, loading, error };
};
