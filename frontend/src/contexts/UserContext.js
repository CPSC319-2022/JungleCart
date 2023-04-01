import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const useUserContext = () => {
  return useContext(UserContext);
};

const UserContextProvider = ({ children }) => {
  const initialUser = {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    departmentId: -1,
    isAdmin: false,
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
