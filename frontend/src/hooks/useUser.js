import { useUserContext } from '@/contexts/UserContext';
import { useFetch } from './useFetch';

export const useUser = async () => {
  const { user } = useUserContext();

  //const { data, loading, error } = useFetch(`/users/${user.id}`, user.accesstokoen);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user.id}`, {
    GET,
    headers: {
      'Content-Type': 'application/json',
      Authentication: `Bearer ${token}`,
    },
  });
  const { data, loading, error } = res
  return { user: data.user, loading, error };
};