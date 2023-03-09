import { useFetch } from './useFetch';

export const usePayment = () => {
  const { user } = useUserContext();

  const { data, loading, error } = useFetch(`/users/${user.id}/payments`);
  return { payment: data.payment, loading, error };
};
