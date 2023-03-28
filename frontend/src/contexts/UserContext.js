import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const useUserContext = () => {
  return useContext(UserContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setCurrUser] = useState({
    id: 1,
    first_name: '',
    last_name: '',
    email: '',
    accessToken: '',
  });

  const setUser = (id, first_name, last_name, email) => {
    setCurrUser((prev) => ({
      ...prev,
      id: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
    }));
  };

  const setAccessToken = (accessToken) => {
    setCurrUser((prev) => ({
      ...prev,
      accessToken,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { useUserContext, UserContextProvider };
