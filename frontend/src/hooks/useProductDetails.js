import { useFetch } from './useFetch';

export const useProductDetails = (id) => {
  const { data, loading, error } = useFetch(`/products/${id}`);
  return { data: data, loading, error };
};
