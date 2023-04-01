import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const useUserContext = () => {
  return useContext(UserContext);
};

const UserContextProvider = ({ children }) => {
  const initialUser = {
    id: -1,
    first_name: '',
    last_name: '',
    email: '',
    department_id: -1,
    is_admin: false,
    id_token: 0,
    accessToken: '',
  };
  const [user, setCurrUser] = useState(initialUser);

  const setUser = (fields) => {
    const containsInvalidField = Object.keys(fields).some(
      (field) => !Object.keys(initialUser).includes(field)
    );
    if (containsInvalidField) {
      throw new Error('Invalid field');
    }
    setCurrUser((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // const [userId, setCurrId] = useState(0);

  // const setUserId = (userId) => {
  //   setCurrId(userId)
  // };

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
        // userId,
        // setUserId,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { useUserContext, UserContextProvider };
