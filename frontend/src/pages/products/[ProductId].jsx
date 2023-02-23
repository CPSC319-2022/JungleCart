import React from 'react';
import styles from '../../styles/ProductDetails.module.css';
import Image from 'next/image';

const ProductDetails = () => {
  const product = {
    id: 1,
    seller_id: 1,
    name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
    price: 5.87,
    discount: 37, // %
    description:
      'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    shipping_constraint: [
      {
        region: 'BC',
        distance: 14.3, // float (km based)
      },
    ],
    img: ['https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg'],
    total_quantity: 10,
    category_id: 1,
  };

  return (
    <div className="flex flex-col md:flex-col items-start justify-center   px-4 py-8 space-y-4 md:space-y-0 md:space-x-4 h-screen ">
      <div className="flex flex-col md:flex-row items-start  flex-start md:justify-between px-4 py-8 space-y-4 md:space-y-0 md:space-x-4 h-full">
        <div className="flex-1 w-full md:w-1/2 max-w-md relative  h-4/6">
          <Image
            class=" object-scale-down p-5"
            src={product.img[0]}
            alt={'product image'}
            fill
          />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xlg font-bold text-primary-dark">
            {product.price.toFixed(2)} CAD
          </p>
          <p className="text-lg mt-4">{product.description}</p>
        </div>
      </div>
      <table className={styles.table}>
        <thead></thead>
        <tbody>
          <tr>
            <td>Shipping</td>
            <td>Shipped only in BC</td>
          </tr>
          <tr>
            <td>Seller</td>
            <td>Product seller id/name</td>
          </tr>
          <tr>
            <td>Status</td>
            <td> {product.status}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetails;
