import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { NavDropdown } from '@/components/organisms/navDropdown/NavDropdown';

const Navbar = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  const { push, query } = router;
  const debouncedSearchTerm = useDebounce(searchText);
  const [isSearching, setIsSearching] = useState(false);

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
      setIsSearching(false);
    }
  };

  const handleMobileSearch = (e) => {
    setSearchText(e.target.value);
    if (!e.target.value) {
      setIsSearching(false);
    }
  };

  return (
    <div className="rounded-lg p-1 sticky top-0 z-30">
      <div className="absolute w-full h-full top-0 blur-md bg-base-200"></div>
      <div
        className={`${styles.mobileNav} bg-base-100 py-2 sticky rounded-xl shadow-sm bg-gradient-to-r from-[#94a698] to-[#acc2b1]`}
      >
        {isSearching ? (
          <input
            type="text"
            className="mx-2 w-80 input border-base-200 px-2 bg-base-100  rounded-lg border"
            onChange={handleMobileSearch}
            onKeyDown={(e) => handleKeyDown(e)}
            value={searchText}
            placeholder="Search the Jungle"
          />
        ) : (
          <Link
            className={`${styles.logo} btn btn-ghost normal-case text-xl font-black text-base-100`}
            href="/products"
          >
            JungleCart
          </Link>
        )}
        <div className={styles.navRight}>
          {!isSearching && (
            <button
              className="flex w-12 h-12 justify-center items-center"
              onClick={() => setIsSearching((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 96 960 960"
                width="24"
              >
                <path d="M796 935 533 672q-30 26-69.959 40.5T378 727q-108.162 0-183.081-75Q120 577 120 471t75-181q75-75 181.5-75t181 75Q632 365 632 471.15 632 514 618 554q-14 40-42 75l264 262-44 44ZM377 667q81.25 0 138.125-57.5T572 471q0-81-56.875-138.5T377 275q-82.083 0-139.542 57.5Q180 390 180 471t57.458 138.5Q294.917 667 377 667Z" />
              </svg>
            </button>
          )}
          <NavDropdown />
        </div>
      </div>

      <div className={styles.desktopNav}>
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
            <NavDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
