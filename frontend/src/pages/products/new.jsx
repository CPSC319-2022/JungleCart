import { Button } from '@/components/atoms/button/Button';
import Separator from '@/components/atoms/separator/Separator';
import { Form } from '@/components/organisms/form/Form';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from '../../styles/CreateProduct.module.css';

const CreateProductPage = () => {
  const router = useRouter();
  const initialProduct = {
    name: "",
    price: 0,
    quantity: 0,
    category: "home",
    photo: null,
    description: ""
  }
  const [product, setProduct] = useState(initialProduct)

  return <main>
    <h2 className={`section-header ${styles.title}`}>Create Product</h2>
    <Separator />
    <Form product={product} setProduct={setProduct} />
    <div className={styles.controls}>
      <Button variant="secondary" onClick={() => router.push("/inventory")}>Cancel</Button>
      <Button onClick={() => router.push("/inventory")}>Publish</Button>
    </div>
  </main>;
};

export default CreateProductPage;
