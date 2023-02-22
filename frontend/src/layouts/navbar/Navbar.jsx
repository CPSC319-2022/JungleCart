import { useState } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      router.replace(`/products?q=${searchText.split(' ')}`);
    }
  };

  return (
    <div className="rounded-lg p-1 sticky top-0 z-10">
      <div className="absolute w-full h-full top-0 blur-md bg-base-200"></div>
      <div className="navbar bg-base-100  sticky rounded-xl shadow-sm bg-gradient-to-r from-[#94a698] to-[#acc2b1]">
        <div className="navbar-start">
          <a
            className="btn btn-ghost normal-case text-xl font-black text-base-100"
            href="./products"
          >
            JungleCart
          </a>
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
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">Profile</a>
              </li>
              <li>
                <a>Cart</a>
              </li>
              <li>
                <a>Seller Dashboard</a>
              </li>
              <li>
                <a href="./products">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
