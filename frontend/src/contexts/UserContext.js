import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const useUserContext = () => {
  return useContext(UserContext);
};

export const initialUser = {
  id: -1,
  firstName: '',
  lastName: '',
  email: '',
  departmentId: -1,
  isAdmin: false,
  accessToken: '',
};

const getUserFromLocalStorage = () => {
  if (typeof window === 'undefined') return initialUser;
  const user = Object.keys(initialUser).reduce((acc, key) => {
    const value = window.localStorage.getItem(key);
    if (value) {
      acc[key] = JSON.parse(value);
    }
    return acc;
  }, {});
  return user;
};

const UserContextProvider = ({ children }) => {
  const [user, setCurrUser] = useState(getUserFromLocalStorage());

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
    if (typeof window === 'undefined') return;

    Object.keys(fields).forEach((fieldKey) => {
      if (fields[fieldKey] !== null) {
        window.localStorage.setItem(fieldKey, JSON.stringify(fields[fieldKey]));
      }
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { useUserContext, UserContextProvider };
