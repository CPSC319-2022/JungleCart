import Separator from '@/components/atoms/separator/Separator';
import React, { useEffect, useMemo } from 'react';
import styles from './Admin.module.css';
// import { Button } from '@/components/atoms/button/Button';
import { useRouter } from 'next/router';
import { useUsers } from '@/hooks/useUsers';
import { useUserContext } from '@/contexts/UserContext';
import { fetcherWithSpinner } from '@/lib/api';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { Pulser } from '@/components/atoms/pulser/Pulser';

const Admin = () => {
  const router = useRouter();
  const { data: users, loading, triggerUsersFetch } = useUsers();
  const { user: user } = useUserContext();
  const { showPopup } = usePopupContext();

  useEffect(() => {
    if (!user.isAdmin) {
      router.push('/products');
    }
  }, [user, router]);

  const spreadedUsers = useMemo(() => {
    if (users) {
      let admins = users.admin.map((admin) => {
        return { ...admin, is_admin: true };
      });
      return [...admins, ...users.user];
    }
    return [];
  }, [users]);

  const removeUserById = (e, id) => {
    if (id == user.id) {
      showPopup(popupStates.WARNING, 'Cannot remove your own account!');
    } else {
      fetcherWithSpinner(e.target, {
        url: `/admins/${user?.id}/users/${id}`,
        method: 'DELETE',
        token: user.accessToken,
      })
        .then(() => {
          showPopup(popupStates.SUCCESS, 'User deleted!');
          triggerUsersFetch();
        })
        .catch(() => {
          // showPopup(popupStates.ERROR, error.message);
          triggerUsersFetch();
        });
    }
  };

  const handleRemove = (e, user_id) => {
    e.stopPropagation();
    removeUserById(e, user_id);
    console.log(user_id);
  };

  const handleUserClick = (user_id) => {
    router.push('admin/viewuser/' + user_id);
  };

  if (loading) {
    return (
      <main>
        <section>
          <Pulser />
          <Pulser />
          <Pulser />
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section>
        <div className="section-header pl-2">Users</div>
        <Separator />
        {/* <div className="flex gap-3 w-full pb-4">
          <input
            type="text"
            placeholder="Search for users..."
            className="input input-bordered grow"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div> */}

        <div className={'card bg-gray-light p-2 rounded-md w-full'}>
          <div className={'flex gap-x-2 py-1 items-center '}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className={'text-sm'}>
              The panel below is scrollable. Scroll through to look at users in
              the system. You can click on a user to look at more details about
              the user.
            </p>
          </div>
        </div>

        <div className={styles.scrollable}>
          {/* <Button onClick={() => addUser()}>Add User</Button> */}
          <ul className="list-none h-auto flex flex-col divide-y divide-gray-medium">
            {spreadedUsers.map((user) => {
              return (
                <li
                  key={user.id}
                  className={`cursor-pointer flex w-full justify-between p-2 md:p-4 ${styles.userlist_item}`}
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="flex flex-col">
                    <div className="font-bold text-xl flex">
                      {user.first_name} {user.last_name}
                      {user.is_admin && (
                        <div className="ml-2 pt-1 font-bold text-sm text-primary-dark">
                          Admin
                        </div>
                      )}
                    </div>
                    <div>{user.email}</div>
                  </div>
                  <div
                    className="font-bold text-error cursor-pointer flex items-center hover:underline"
                    onClick={(e) => handleRemove(e, user.id)}
                  >
                    Remove
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
};
export default Admin;
