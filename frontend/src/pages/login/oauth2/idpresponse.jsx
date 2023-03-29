import { useUserContext } from '@/contexts/UserContext';
import { decodePath } from 'lib/auth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
const jwt = require(`jsonwebtoken`);
export default function RedirectHandler() {
  const router = useRouter();
  const { userId, setUserId, setUser, setAccessToken } = useUserContext();
  useEffect(() => {
    const queries = decodePath(router.asPath);
    if (!queries) return;
    if (
      queries.access_token &&
      queries.id_token &&
      queries.expires_in &&
      queries.token_type
    ) {
      const userRawData = decodeIdToken(queries.id_token);
      //const accessData = getUserInfo(queries.access_token);
      if (userRawData.email != null) {
        // validateUser(userRawData.email);
        // setAccessToken(queries.access_token);
        router.push('/products');
      }
    }
  }, [router]);

  useEffect(() => {
    if (userId && userId > 0) {
      router.push('/products');
    }
  }, [userId]);

  const decodeIdToken = (idToken) => {
    const decoded = jwt.decode(idToken, { complete: true });
    return decoded.payload;
  };

  const getUserInfo = async (token) => {
    try {
      const response = await (
        await fetch(`${process.env.NEXT_PUBLIC_AUTH_USERINFO_URL}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(token),
        })
      ).json();
      console.log('result ::: ', response);
      return response;
    } catch (err) {
      console.log(err.message);
    }
  };

  const validateUser = async (email) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/login?email=${email}`;
    try {
      const user = await (await fetch(url)).json();
      console.log({ user });
      setUser(user);
      // setUserId(user.id);
    } catch (err) {
      console.log(err);
      if (err.message == 'no user data') {
        await signupUser();
      }
    }
  };

  const signupUser = async (email) => {
    // TODO: to store other info. temporarily storing only email
    // cognito pre-sign trigger
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`;
    const userSignupInput = {
      email: email,
      firstName: '',
      lastName: '',
    };
    try {
      const user = await (
        await fetch(url, {
          method: 'POST',
          body: JSON.stringify(userSignupInput),
        })
      ).json();

      setUser(user);
      // setUserId(user.id);
    } catch (err) {
      console.log(err);
    }
  };

  return <div>RedirectHandler</div>;
}
