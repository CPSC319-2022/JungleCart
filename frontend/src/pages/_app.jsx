import Portal from '@/components/organisms/popup/Popup';
import { PopupContextProvider } from '@/contexts/PopupContext';
import { UserContextProvider } from '@/contexts/UserContext';
import BasicLayout from '@/layouts/basicLayout/BasicLayout';
import NoNavbarLayout from '@/layouts/noNavbarLayout/noNavbarLayout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  if (Component.noLayout) {
    return (
      <PopupContextProvider>
        <NoNavbarLayout>
          <Portal />
          <Component {...pageProps} />
        </NoNavbarLayout>
      </PopupContextProvider>
    );
  }

  return (
    <UserContextProvider>
      <PopupContextProvider>
        <BasicLayout>
          <Portal />
          <Component {...pageProps} />
        </BasicLayout>
      </PopupContextProvider>
    </UserContextProvider>
  );
}
