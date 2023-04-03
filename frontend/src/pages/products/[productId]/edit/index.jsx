import Separator from '@/components/atoms/separator/Separator';
import { Form } from '@/components/organisms/form/Form';
import { useUserContext } from '@/contexts/UserContext';
import { fetcher } from '@/lib/api';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './EditProduct.module.css';

const EditProductPage = () => {
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
  const { user } = useUserContext();

  const router = useRouter();
  const productId = router.query.productId;

  useEffect(() => {
    if (!router.query?.productId) return;
    fetcher({ url: `/products/${productId}`, token: user.accessToken }).then(
      (data) => {
        if (user.id !== data.sellerId) router.push(`/products/${productId}`);
        const {
          img,
          discount,
          createdAt,
          updatedAt,
          productStatusId,
          shippingMethodId,
          ...productToEdit
        } = data;
        productToEdit.img = img[0];
        productToEdit.promoting = discount > 0;
        productToEdit.discountedPrice = discount;
        console.log({
          productToEdit,
          createdAt,
          updatedAt,
          productStatusId,
          shippingMethodId,
        });
        setProduct(productToEdit);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <main>
      <h2 className={`section-header ${styles.title}`}>Edit Product</h2>
      <Separator />
      <Form product={product} setProduct={setProduct} />
    </main>
  );
};

export default EditProductPage;
