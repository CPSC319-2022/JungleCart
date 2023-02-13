import Separator from '@/components/atoms/separator/Separator';
import { Form } from '@/components/organisms/form/Form';
import React from 'react';
import styles from '../../styles/Cart.module.css';

const CreateProductPage = () => {
  return <main>
    <h2 className="section-header">Create Product</h2>
    <Separator />
    <Form />
  </main>;
};

export default CreateProductPage;
