import { useUserContext } from '@/contexts/UserContext';
import { decodePath } from 'lib/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
const jwt = require(`jsonwebtoken`);
export default function RedirectHandler() {
  const router = useRouter();
  const { setUserId, setAccessToken } = useUserContext();
  const { userId } = useUserContext();
  useEffect(() => {
    const queries = decodePath(router.asPath);
    if (!queries) return;
    if (
      queries.access_token &&
      queries.id_token &&
      queries.expires_in &&
      queries.token_type
    ) {
      const decoded = jwt.decode(queries.id_token, { complete: true });
      const email = decoded.payload['email'];
      if (email != null) {
        validateUser(email);
        setAccessToken(queries.access_token);
      }
      if (userId > 0) {
        router.push('/products');
      }
    }
  }, [router]);

  const validateUser = async (email) => {
    console.log('email ::: ', email);
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?email=${email}`;
    fetch(url)
      .then((response) => response.json())
      .then((userId) => {
        setUserId(userId);
      });
  };

  return <div>RedirectHandler</div>;
}
