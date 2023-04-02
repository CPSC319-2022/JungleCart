import { useUserContext } from '@/contexts/UserContext';
import { decodePath } from 'lib/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styles from './Auth.module.css';

function RedirectHandler() {
  const router = useRouter();
  const { setUser } = useUserContext();
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
      setUser({ accessToken: queries.id_token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const validateUser = async (idToken) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;
      const { user } = await (
        await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
      ).json();
      const { id, email, first_name, last_name, is_admin, department_id } =
        user;
      setUser({
        id,
        email,
        firstName: first_name,
        lastName: last_name,
        isAdmin: is_admin,
        departmentId: department_id,
      });
      if (id && id > 0) {
        router.push('/products');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.authContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 96 960 960"
          width="48"
        >
          <path
            fill="#548d6f"
            d="M220 976q-24.75 0-42.375-17.625T160 916V482q0-24.75 17.625-42.375T220 422h70v-96q0-78.85 55.606-134.425Q401.212 136 480.106 136T614.5 191.575Q670 247.15 670 326v96h70q24.75 0 42.375 17.625T800 482v434q0 24.75-17.625 42.375T740 976H220Zm0-60h520V482H220v434Zm260.168-140Q512 776 534.5 753.969T557 701q0-30-22.668-54.5t-54.5-24.5Q448 622 425.5 646.5t-22.5 55q0 30.5 22.668 52.5t54.5 22ZM350 422h260v-96q0-54.167-37.882-92.083-37.883-37.917-92-37.917Q426 196 388 233.917 350 271.833 350 326v96ZM220 916V482v434Z"
          />
        </svg>
        <h1 className={styles.title}>Redirecting...</h1>
      </div>
    </main>
  );
}

RedirectHandler.noLayout = true;

export default RedirectHandler;
