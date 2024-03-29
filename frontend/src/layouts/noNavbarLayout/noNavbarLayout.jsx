import React from 'react';
import Head from 'next/head';
import styles from './noNavbarLayout.module.css';

const NoNavbarLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/gorilla.ico" />
      </Head>
      <div className={styles.wrapper}>{children}</div>
    </>
  );
};

export default NoNavbarLayout;
