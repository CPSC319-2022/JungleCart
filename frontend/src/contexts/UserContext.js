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

  const validateUser = async (idToken) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;
      const { user } = await (
        await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
      ).json();
      console.log("user ::", user)
      const { id, email, first_name, last_name, is_admin, department_id } =
        user;
      setUser({
        id,
        email,
        firstName: first_name,
        lastName: last_name,
        isAdmin: is_admin,
        departmentId: department_id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        validateUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { useUserContext, UserContextProvider };
