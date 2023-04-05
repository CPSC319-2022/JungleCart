import { createContext, useContext, useState } from 'react';

const CheckoutTimeContext = createContext();

const useCheckoutTimeContext = () => {
  return useContext(CheckoutTimeContext);
};

const CheckoutTimeContextProvider = ({ children }) => {
  const [remainingCheckoutTime, setRemainingCheckoutTime] = useState(0);

  return (
    <CheckoutTimeContext.Provider
      value={{
        remainingCheckoutTime,
        setRemainingCheckoutTime,
      }}
    >
      {children}
    </CheckoutTimeContext.Provider>
  );
};

export { useCheckoutTimeContext, CheckoutTimeContextProvider };
