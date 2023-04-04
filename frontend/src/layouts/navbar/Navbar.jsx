import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { initialUser, useUserContext } from '@/contexts/UserContext';
import { useDebounce } from '@/hooks/useDebounce';

const Navbar = () => {
  const [searchText, setSearchText] = useState('');
  const { setUser } = useUserContext();
  const { user: currUser } = useUserContext();
  const router = useRouter();
  const { push, query } = router;
  const debouncedSearchTerm = useDebounce(searchText);

  const updateUrlParams = (queries) => {
    const queryDict = queries.reduce((dict, obj) => ({ ...dict, ...obj }), {});
    const newQuery = Object.entries({ ...query, ...queryDict }).reduce(
      (acc, [k, val]) => {
        if (!val) return acc;
        return { ...acc, [k]: val };
      },
      {}
    );
    push({ query: newQuery }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (router.pathname === '/products') {
      updateUrlParams([{ search: debouncedSearchTerm }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, router.pathname]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      router.replace(`/products?search=${searchText.split(' ')}`);
    }
  };

  const logout = () => {
    setUser(initialUser);
    localStorage.clear();
    router.replace('/login');
  };

  return (
    <div className="rounded-lg p-1 sticky top-0 z-10">
      <div className="absolute w-full h-full top-0 blur-md bg-base-200"></div>
      <div className="navbar bg-base-100  sticky rounded-xl shadow-sm bg-gradient-to-r from-[#94a698] to-[#acc2b1]">
        <div className="navbar-start">
          <Link
            className={`${styles.logo} btn btn-ghost normal-case text-xl font-black text-base-100`}
            href="/products"
          >
            JungleCart
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <div className="form-control w-[600px]  h-full">
            <input
              type="text"
              className="input  border-base-200  bg-base-100  rounded-xl border"
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              value={searchText}
              placeholder="Search the Jungle"
            />
          </div>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="flex-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </div>
            </label>

            <ul
              tabIndex={0}
              className="mt-3 py-2 px-4 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link className="px-2" href="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link className="px-2" href="/cart">
                  Cart
                </Link>
              </li>
              <li>
                <Link className="px-2" href="/orders">
                  Orders
                </Link>
              </li>
              <li>
                <Link className="px-2" href="/seller">
                  Seller Dashboard
                </Link>
                {currUser.isAdmin == 1 && (
                  <Link className="px-2" href="/admin">
                    Admin Dashboard
                  </Link>
                )}
              </li>
              <button
                className="px-2 text-sm justify-end text-end"
                onClick={logout}
              >
                Logout
              </button>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
