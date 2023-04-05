import { useCheckoutTimeContext } from '@/contexts/CheckoutTimeContext';
import { FREEZE_TIME } from '@/lib/constants';
import { useEffect } from 'react';

export const useRemainingCheckoutTime = () => {
  const { remainingCheckoutTime, setRemainingCheckoutTime } =
    useCheckoutTimeContext();

  useEffect(() => {
    const checkoutTime = window.localStorage.getItem('checkoutTime');
    if (!checkoutTime) return;
    const interval = setInterval(() => {
      const time = +checkoutTime + FREEZE_TIME - Date.now();
      if (time <= 0) {
        clearInterval(interval);
        setRemainingCheckoutTime(0);
        localStorage.removeItem('checkoutTime');
        return;
      }
      setRemainingCheckoutTime(Math.floor(time / 1000));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { remainingCheckoutTime };
};
