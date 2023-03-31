import { useFetch } from './useFetch';

export const useProducts = () => {
  const { data, loading, error } = useFetch('/products');
  return { products: data.seller.products, loading, error };
};