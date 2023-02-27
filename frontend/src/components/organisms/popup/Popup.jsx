import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Popup.module.css';
import Image from 'next/image';
import success from '@/assets/success.svg';
import warning from '@/assets/warning.svg';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';

const PortalComponent = () => {
  const { popup } = usePopupContext();

  return (
    <Portal>
      {popup.state !== popupStates.NONE && (
        <div className={styles.popup}>
          <Image
            src={popup.state === popupStates.SUCCESS ? success : warning}
            alt={popup.state}
            width={30}
            height={30}
          />
          <p>{popup.message}</p>
        </div>
      )}
    </Portal>
  );
};

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(children, document.querySelector('#popup'))
    : null;
};

export default PortalComponent;
