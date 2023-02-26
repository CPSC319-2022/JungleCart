import { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

const usePopupContext = () => {
  return useContext(PopupContext);
};

export const popupStates = {
  NONE: 'none',
  SUCCESS: 'success',
  WARNING: 'warning',
};

const PopupContextProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    state: popupStates.NONE,
    message: '',
  });

  const showPopup = (type, message) => {
    setPopup({ state: type, message });
    setTimeout(() => setPopup({ state: popupStates.NONE, message: '' }), 3000);
  };

  return (
    <PopupContext.Provider
      value={{
        popup,
        showPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export { usePopupContext, PopupContextProvider };
