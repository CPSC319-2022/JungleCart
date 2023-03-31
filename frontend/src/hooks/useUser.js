import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useUser = () => {
  const { user } = useUserContext();

  const { data, loading, error } = useFetch(`/users/${user.id}`);
  return { user: data.user, loading, error };
};