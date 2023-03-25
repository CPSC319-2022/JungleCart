import { useUserContext } from '@/contexts/UserContext';
import { decodePath } from 'lib/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function RedirectHandler() {
  const router = useRouter();
  const { setAccessToken } = useUserContext();

  useEffect(() => {
    const queries = decodePath(router.asPath);
    if (!queries) return;
    if (
      queries.access_token &&
      queries.id_token &&
      queries.expires_in &&
      queries.token_type
    ) {
      setAccessToken(queries.access_token);
      router.push('/products');
    }
  }, [router]);

  return <div>RedirectHandler</div>;
}
