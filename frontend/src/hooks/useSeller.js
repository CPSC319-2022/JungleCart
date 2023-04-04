import { useFetch } from './useFetch';

export const useSeller = (user_id) => {
  const { data, loading, error, triggerFetch } = useFetch(`/users/${user_id}/seller`);
  return { products: data?.seller.products, loading, error, triggerSellerFetch:triggerFetch };
};