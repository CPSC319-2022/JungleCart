import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const usePayment = () => {
  const { user } = useUserContext();

  const { data, loading, error } = useFetch(`/users/${user.id}/payments`);
  return { data: data?.payment, loading, error };
};
