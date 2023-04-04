import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useAddresses = () => {
  const { user } = useUserContext();

  const { data, loading, error, triggerFetch } = useFetch(
    `/users/${user.id}/addresses`
  );
  return { data: data?.addresses, loading, error, triggerFetch };
};
