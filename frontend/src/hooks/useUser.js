import { useFetch } from './useFetch';

export const useUser = (user_id) => {

  const { data, loading, error, triggerFetch } = useFetch(`/users/${user_id}`);
  return { user: data?.user, loading, error, triggerUserFetch:triggerFetch };
};