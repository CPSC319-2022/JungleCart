import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useAddresses = () => {
  const { user } = useUserContext();

  const { data, loading, error } = useFetch(`/users/${user.id}/addresses`);

  return { addresses: data.addresses, loading, error };
};
