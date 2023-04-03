import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const usePayment = () => {
  const { user } = useUserContext();

  const { data, loading, error, triggerFetch } = useFetch(`/users/${user.id}/payments`);
  return { payment: data?.payment, loading, error, triggerFetch };
};