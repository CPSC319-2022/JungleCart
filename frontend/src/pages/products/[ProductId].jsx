import React, { useEffect, useState } from 'react';
import styles from '../../styles/ProductDetails.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!router.query?.productId) return;
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${router.query.productId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setProduct(data.product);
        return Promise.resolve(data.product);
      })
      .then((product) => {
        return fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${product.seller_id}`
        );
      })
      .then((response) => response.json())
      .then(({ user }) => {
        setSeller(`${user.first_name} ${user.last_name}`);
      });
  }, [router.query]);

  return (
    <div className="flex flex-col md:flex-col items-start justify-center   px-4 py-8 space-y-4 md:space-y-0 md:space-x-4 h-screen ">
      <div className="flex flex-col md:flex-row items-start  flex-start md:justify-between px-4 py-8 space-y-4 md:space-y-0 md:space-x-4 h-full">
        <div className="flex-1 w-full md:w-1/2 max-w-md relative  h-4/6">
          <Image
            className=" object-scale-down p-5"
            src={product?.img}
            alt={'product image'}
            fill
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-2">{product?.name}</h1>
          <p className="text-2xlg font-bold text-primary-dark">
            {product?.price?.toFixed(2)} CAD
          </p>
          <p className="text-lg mt-4">{product?.description}</p>
        </div>
      </div>
      <table className={styles.table}>
        <thead></thead>
        <tbody>
          {product?.shipping_constraint?.[0] && (
            <tr>
              <td>Shipping</td>
              <td>Shipped only in {product.shipping_constraint[0].region}</td>
            </tr>
          )}
          <tr>
            <td>Seller</td>
            <td>{seller}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td> {product?.status}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetails;
