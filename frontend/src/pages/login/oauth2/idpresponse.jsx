import { useUserContext } from '@/contexts/UserContext';
import { decodePath } from 'lib/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
export default function RedirectHandler() {
  const router = useRouter();
  const { userId, setUserId, User, setUser, setAccessToken } = useUserContext();
  useEffect(() => {
    const queries = decodePath(router.asPath);
    if (!queries) return;
    if (
      queries.access_token &&
      queries.id_token &&
      queries.expires_in &&
      queries.token_type
    ) {
      validateUser(queries.id_token);
      setAccessToken(queries.id_token);
    }
  }, [router]);

  useEffect(() => {
    if (userId && userId > 0) {
      router.push('/products');
    }
  }, [userId]);

  const validateUser = async (idToken) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;
      const user = await (
        await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
      ).json();
      setUser(user);
      setUserId(user.id);
    } catch (err) {
      console.log(err);
    }
  };

  return <div>RedirectHandler</div>;
}
