import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const useUserContext = () => {
  return useContext(UserContext);
};


const UserContextProvider = ({ children }) => {
  const [user, setCurrUser] = useState({
    id : 0,
    first_name: "",
    last_name: "",
    email: ""
  });

  const setUser = (id, first_name, last_name, email) => {
    setCurrUser({
        id : id,
        first_name: first_name,
        last_name: last_name,
        email: email
    })
  }

  return (
    <UserContext.Provider
      value={{
        user, setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { useUserContext, UserContextProvider };
