import Separator from "@/components/atoms/separator/Separator";
import React, {useEffect, useState} from "react";
import styles from "./Admin.module.css"
import { users as seedusers }  from "@/seeds/users" ;
import { Button } from "@/components/atoms/button/Button";
import { useRouter } from "next/router";

const Admin = () => {
    const router = useRouter();
    const [users, setUsers] = useState(seedusers)
    const [searchText, setSearchText] = useState("")

    useEffect(() => {
        //fetch users
    }, [])

    const handleRemove = (e, user_id) => {
        e.stopPropagation();
        console.log(user_id)
    }

    const handleUserClick = (user_id) => {
        router.push("admin/viewuser/" + user_id)
    }

    const handleSearch = () => {
        console.log(searchText)
    }

    return(
        <main>
            <section>
                <div className="section-header">
                    Users
                </div>
                <Separator />
                <div className="flex gap-3 w-full">
                    <input type="text" placeholder="Search for users..." className="input input-bordered grow" onChange={(e) => setSearchText(e.target.value)}/>
                    <div className="flex">
                        <Button onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className="overflow-y-auto w-full mt-8">
                    <ul className="list-none flex flex-col divide-y divide-gray-medium max-h-144 overflow-y-auto">
                        {users.map((user) => {
                            console.log(user.is_admin == 1)
                            return (
                              <li
                                key={user.id}
                                className={` flex w-full justify-between p-5 ${styles.userlist_item}`}
                                onClick={() => handleUserClick(user.id)}
                              >
                                <div className="flex flex-col">
                                  <div className="font-bold text-xl flex">
                                    {user.first_name} {user.last_name}
                                    {user.is_admin == 1 && 
                                    <div className="ml-2 font-bold text-sm text-primary-dark">
                                      Admin
                                    </div>}
                                  </div>
                                  <div>{user.email}</div>
                                </div>
                                <div className="font-bold text-error cursor-pointer flex items-center" onClick={(e) => handleRemove(e, user.id)}>
                                  Remove
                                </div>
                              </li>
                            );
                        })}

                    </ul>
                </div>
            </section>
        </main>
    )
}
export default Admin