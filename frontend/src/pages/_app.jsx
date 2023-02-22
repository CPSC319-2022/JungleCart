import BasicLayout from '@/layouts/basicLayout/BasicLayout';
import NoNavbarLayout from '@/layouts/noNavbarLayout/noNavbarLayout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {

  if(Component.noLayout){
    return(
      <>
      <NoNavbarLayout>
        <Component {...pageProps} />
      </NoNavbarLayout>
    </>
    )
  }

  return (
    <>
      <BasicLayout>
        <Component {...pageProps} />
      </BasicLayout>
    </>
  );
}
