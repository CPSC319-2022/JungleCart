import Link from 'next/link';
import { initialUser, useUserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/router';

export const NavDropdown = () => {
  const { user: currUser, setUser } = useUserContext();

  const router = useRouter();

  const logout = () => {
    setUser(initialUser);
    localStorage.clear();
    router.replace('/login');
  };

  return (
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
        <button className="px-2 text-sm justify-end text-end" onClick={logout}>
          Logout
        </button>
      </ul>
    </div>
  );
};
