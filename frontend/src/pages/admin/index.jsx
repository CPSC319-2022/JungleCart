import Separator from '@/components/atoms/separator/Separator';
import React, { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { useRouter } from 'next/router';
import { users as seedusers } from '@/seeds/users';
// import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/atoms/button/Button';
import { fetcher } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';


const Admin = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');

  // const { data: users } = useUsers();
  const { user } = useUserContext();
  const { showPopup } = usePopupContext();

  useEffect(() => {
    //fetch users
    setUsers(seedusers)
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

  let options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };


  const addUser = () => {  
    fetcher({
        url: `/admin/${user.id + (8 % user.id + 1)}/viewuser`, // modulus fixes edge case of same
                                                      // user being added twice. Possibly needs        method: 'POST',                                       
                                                      // fixing of url.
        method: 'POST',
        token: user.token,                                    
        body: {
        token: user.token,
        id: user.id + (8 % user.id + 1),
        is_admin: 0,
        first_name: "New",
        last_name: "User",
        email: "-",
        department_id: user.id + (8 % user.id + 1),
        created_at: new Intl.DateTimeFormat('en-US', options).format(
          new Date()
        )
        },
      }).then((res) => {
        console.log('New user created', res);
        showPopup(popupStates.SUCCESS, 'New user created!'); 
      })
      .catch((error) => {
            console.log(error);
            showPopup(popupStates.ERROR, error.message); 
          });
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
          <Button onClick={() => addUser()}>Add User</Button>
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
