import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const useUserContext = () => {
  return useContext(UserContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setCurrUser] = useState({
    id: 0,
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

  const [userId, setCurrId] = useState(0);

  const setUserId = (userId) => {
    setCurrId(userId)
  };

  const setAccessToken = (accessToken) => {
    setCurrId((prev) => ({
      ...prev,
      accessToken,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userId,
        setUserId,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { useUserContext, UserContextProvider };
