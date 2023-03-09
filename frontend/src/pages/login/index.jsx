import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './login.module.css';
import YourSvg from '../../../public/login.svg';
import { useEffect } from 'react';
import { decodePath } from 'lib/auth';
import { useUserContext } from '@/contexts/UserContext';

const Login = () => {
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
      console.log('saving access token');
      setAccessToken(queries.access_token);
      router.push('/products');
    }
  }, [router]);

  const login = () => {
    const encodedUrl = encodeURIComponent(process.env.NEXT_PUBLIC_FRONTEND_URL);
    const authUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}&redirect_uri=${encodedUrl}`;
    router.push(authUrl);
  };

  return (
    <div className={styles.login_master_container}>
      <div className="hero min-h-screen">
        <Image fill style={{ objectFit: 'cover' }} src={YourSvg} alt="edit" />
        <div className="hero-overlay bg-opacity-0"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 text-black">
              <div className="card-body text-left">
                <h1 className="mb-5 text-2xl font-bold ">
                  Welcome to <span className="text-primary">Jungle Cart</span>
                </h1>
                <p className="mb-5">
                  An e-commerce platform for Amazon employees. When you are
                  ready click to get started.
                </p>
                <div className="form-control mt-6">
                  <button className="btn btn-primary" onClick={login}>
                    Get Started
                  </button>
                </div>
                <h6 className="pt-4 text-sm font-thin ">
                  Users are subject to approval by admin(s) before being granted
                  access
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.noLayout = true;

export default Login;
