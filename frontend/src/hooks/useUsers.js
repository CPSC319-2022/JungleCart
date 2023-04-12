import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useUsers = () => {
  const { user } = useUserContext();

  const { data, loading, error, triggerFetch } = useFetch(`/admins/${user.id}/users`);
  return { data, loading, error, triggerUsersFetch: triggerFetch };
};