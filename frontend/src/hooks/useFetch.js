import { useUserContext } from '@/contexts/UserContext';
import { useState } from 'react';

export const useFetch = (url) => {
  const { user } = useUserContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user?.accessToken) {
      setLoading(false);
      setError(true);
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
      headers: { Authentication: `Bearer ${user.accessToken}` },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong when fetching data');
      })
      .then((data) => {
        setData(data);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  return { data, loading, error };
};
