import Separator from '@/components/atoms/separator/Separator';
import { Form } from '@/components/organisms/form/Form';
import React, { useState } from 'react';
import styles from './CreateProduct.module.css';

const CreateProductPage = () => {
  const initialProduct = {
    name: '',
    price: 0,
    promoting: false,
    discountedPrice: 0,
    totalQuantity: 0,
    categoryId: 1,
    img: null,
    description: '',
    address: '',
  };
  const [product, setProduct] = useState(initialProduct);

  return (
    <main>
      <h2 className={`section-header ${styles.title}`}>Create Product</h2>
      <Separator />
      <Form product={product} setProduct={setProduct} />
    </main>
  );
};

export default CreateProductPage;
