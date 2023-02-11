import BasicLayout from '@/layouts/basicLayout/BasicLayout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <BasicLayout>
      <Component {...pageProps} />
    </BasicLayout>
  );
}
