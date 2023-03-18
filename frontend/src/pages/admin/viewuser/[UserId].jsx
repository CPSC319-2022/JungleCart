import styles from '@/components/organisms/userCard/UserCard.module.css';
//import { UserCard } from '@/components/organisms/userCard/UserCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SortAndFilter } from '@/components/organisms/sortAndFilter/SortAndFilter';
//import {products} from '@/seeds/products';
//import { userAgent } from 'next/server';

//import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import Image from 'next/image';
import iconUserGreen from '@/assets/Icon-User-green.png';
//import AdminDashboard from '../[AdminId]';

export const UserDetails = ({ id }) => {
  const router = useRouter();
  const UserId = router.query.UserId;
  const [page, setPage] = useState(1);
  useEffect(() => {
    updateUrlParams('page', page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  const { push, query } = useRouter();
  if (!UserId) {
    return <div></div>;
  }

  const routeToUser = async () => {
      
        router.push(`/admins/${UserId}`);
      
  };



  //console.log(products);
  

  //const {products} = products.products;
  // useEffect(() => {
  //   if (!query.page) {
  //     push({ query: { ...query, page: 1 } }, undefined, { shallow: true });
  //   }
  //   fetch(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?` +
  //       new URLSearchParams({
  //         search: query.search || '',
  //         sort: query.sort || '',
  //         category: query.category || '',
  //         page,
  //       })
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setProducts(data.products);
  //     });
  // }, [query, page, push]);

  const updateUrlParams = (key, value) => {
    const newQuery = Object.entries({ ...query, [key]: value }).reduce(
      (acc, [k, val]) => {
        if (!val) return acc;
        return { ...acc, [k]: val };
      },
      {}
    );
    push({ query: newQuery }, undefined, { shallow: true });
  };

  return (
    <main>
      <SortAndFilter updateUrlParams={updateUrlParams} />
      <div
      className={`${styles.card} hover:shadow-lg rounded-md shadow-md bg-gray-light`}
    >
      <div className=" relative md:container h-60  p-5">
        <figure>
          {' '}
          <Image
            className=" object-scale-down p-5"
            src="../../../assets/Icon-User-green.svg"
            alt="PNG User image"
            fill
            onClick={() => router.push(`/admin/viewuser/${id}`)}
          />
        </figure>
      </div>
      <div className={styles.info}>
        <div
          className="tooltip tooltip-closed tooltip-top tooltip-primary text-left"
          data-tip={id}
        >
          <h2 className={styles.title}>User {id}</h2>
        </div>
        <div className="w-full flex justify-between">
          
          <button className={styles.button} onClick={routeToUser}>
            To Admin `${UserId}` // unsure of how to render admin id number
          </button>
        </div>
      </div>
    </div>
      <div className=" max-w-7xl grid grid-cols-auto md:grid-cols-3 lg:grid-cols-4 gap-4 gap-x-2 shadow-sm">
        <img src={iconUserGreen}/>;
      </div>
      <div className="flex w-full justify-center p-5">
        <div className={styles.buttonGroup}>
          <button
            disabled={page === 1}
            className={styles.previous}
            onClick={() => setPage((page) => page - 1)}
          >
            «
          </button>
          <span>Page {page}</span>
          {/* TODO: disable next button if it's the last page */}
          <button
            className={styles.next}
            onClick={() => setPage((page) => page + 1)}
          >
            »
          </button>
        </div>
      </div>
    </main>
  );
}


export default UserDetails;