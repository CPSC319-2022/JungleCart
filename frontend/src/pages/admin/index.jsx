import Separator from '@/components/atoms/separator/Separator';
import React, { useEffect, useMemo } from 'react';
import styles from './Admin.module.css';
// import { useUsers } from '@/hooks/useUsers';
// import { Button } from '@/components/atoms/button/Button';
// import { fetcher } from '@/lib/api';
// import { useUserContext } from '@/contexts/UserContext';
// import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { useRouter } from 'next/router';
import { useUsers } from '@/hooks/useUsers';


const Admin = () => {
  const router = useRouter();
  // const [users, setUsers] = useState([]);
  const {data: users, error} = useUsers();
  // const { user } = useUserContext();
  // const { showPopup } = usePopupContext();

  const spreadedUsers = useMemo(() => {
    if(users) {
      let admins = users.admin.map((admin) => {
        return {...admin, is_admin: true}
      })
      return [...admins, ...users.user]
    }
    return []
  }, [users])

  useEffect(() => {
    console.log(users)
  }, [users])


  useEffect(() => {
    //TODO: check if current logged in user is admin, otherwise redirect back to products page
    //fetch users
    // setUsers(seedusers)
    if(error) console.log(error)
  }, [error]);

  // const usersSpreaded = useMemo(() => [users.admin, ...users.user], [users])

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
        {/* <div className="flex gap-3 w-full pb-4">
          <input
            type="text"
            placeholder="Search for users..."
            className="input input-bordered grow"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div> */}
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
