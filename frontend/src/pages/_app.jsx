import Portal from '@/components/organisms/popup/Popup';
import { CheckoutTimeContextProvider } from '@/contexts/CheckoutTimeContext';
import { PopupContextProvider } from '@/contexts/PopupContext';
import { UserContextProvider } from '@/contexts/UserContext';
import BasicLayout from '@/layouts/basicLayout/BasicLayout';
import NoNavbarLayout from '@/layouts/noNavbarLayout/noNavbarLayout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  if (Component.noLayout) {
    return (
      <UserContextProvider>
        <PopupContextProvider>
          <NoNavbarLayout>
            <Portal />
            <Component {...pageProps} />
          </NoNavbarLayout>
        </PopupContextProvider>
      </UserContextProvider>
    );
  }

  return (
    <UserContextProvider>
      <PopupContextProvider>
        <CheckoutTimeContextProvider>
          <BasicLayout>
            <Portal />
            <Component {...pageProps} />
          </BasicLayout>
        </CheckoutTimeContextProvider>
      </PopupContextProvider>
    </UserContextProvider>
  );
}
