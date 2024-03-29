import { useUserContext } from '@/contexts/UserContext';
import { fetcher } from '@/lib/api';
import { useEffect, useState } from 'react';

export const useFetch = (url) => {
  const { user } = useUserContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [trigger, setTrigger] = useState(false);

  const triggerFetch = () => {
    setTrigger(!trigger);
  };

  useEffect(() => {
    // if (!user?.accessToken) {
    //   setLoading(false);
    //   setError(true);
    //   return;
    // }
    setLoading(true);
    fetcher({ url, token: user.accessToken })
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
  }, [user, url, trigger]);

  return { data, loading, error, triggerFetch };
};
