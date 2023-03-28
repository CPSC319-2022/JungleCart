import { useFetch } from './useFetch';

export const useProductDetails = (id) => {
  if (!id || typeof id !== 'string') return;
  const { data, loading, error } = useFetch(`/products/${id}`);
  console.log('use', data);
  return { data: data, loading, error };
};
