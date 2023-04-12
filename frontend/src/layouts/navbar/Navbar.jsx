import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { NavDropdown } from '@/components/organisms/navDropdown/NavDropdown';

const Navbar = () => {
  const [searchText, setSearchText] = useState('');
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


  return (
    <div className="rounded-none sticky top-0 z-30 ">

        <div className="navbar min-h-0 p-1 w-full   bg-[#94a698]   shadow-lg relative">
          <div className="navbar-start shrink ">

            <Link
              className={` rounded-md rounded-br-none rounded-tr-none btn btn-ghost bg-none h-full  px-3 p-0 normal-case text-xl font-bold text-base-100 `}
              href="/products"
            >
              Jungle Cart
            </Link>
          </div>
          <div className="navbar-center shrink  w-full h-10">
            <div className="form-control w-full  relative">
              <div className={"p-0 rounded-sm  w-full z-10  h-fit flex items-center "}>

                <Link
                  className={`rounded-sm rounded-br-none rounded-tr-none btn btn-ghost bg-black bg-opacity-10 h-full  px-1 p-0 normal-case text-md  text-sm text-base-100  `}
                  href="/products"
                >
                  Products
                </Link>
                <input
                  type="text"
                  className="input  rounded-sm  rounded-bl-none rounded-tl-none max-w-lg  w-full  shadow-2xl bg-base-100  border-none border-[#acc2b1]"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
          <div className="navbar-end w-fit">
            <NavDropdown />
          </div>
        </div>

    </div>
  );
};

export default Navbar;
