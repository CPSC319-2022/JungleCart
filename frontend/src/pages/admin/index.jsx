import Separator from '@/components/atoms/separator/Separator';
import React, { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { users as seedusers } from '@/seeds/users';
import { useRouter } from 'next/router';

const Admin = () => {
  const router = useRouter();
  const [users] = useState(seedusers);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    //fetch users
  }, []);

  const searchedUsers = users
    .filter((user) => {
      return (
        user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a.is_admin) return -1;
      if (b.is_admin) return 1;
      if (a.first_name < b.first_name) return -1;
      return 1;
    });

  const handleRemove = (e, user_id) => {
    e.stopPropagation();
    console.log(user_id);
  };

  const handleUserClick = (user_id) => {
    router.push('admin/viewuser/' + user_id);
  };

  return (
    <main className={styles.container}>
      <section>
        <div className="section-header pl-2">Users</div>
        <Separator />
        <div className="flex gap-3 w-full pb-4">
          <input
            type="text"
            placeholder="Search for users..."
            className="input input-bordered grow"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className={styles.scrollable}>
          <ul className="list-none h-auto flex flex-col divide-y divide-gray-medium">
            {searchedUsers.map((user) => {
              return (
                <li
                  key={user.id}
                  className={` flex w-full justify-between p-2 md:p-4 ${styles.userlist_item}`}
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className="flex flex-col">
                    <div className="font-bold text-xl flex">
                      {user.first_name} {user.last_name}
                      {user.is_admin == 1 && (
                        <div className="ml-2 pt-1 font-bold text-sm text-primary-dark">
                          Admin
                        </div>
                      )}
                    </div>
                    <div>{user.email}</div>
                  </div>
                  <div
                    className="font-bold text-error cursor-pointer flex items-center"
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
