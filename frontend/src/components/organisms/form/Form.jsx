import { ImageInput } from '@/components/atoms/imageInput/ImageInput';
import Image from 'next/image';
import React, { useRef } from 'react';
import styles from './Form.module.css';
import dollor from '@/assets/price.svg';
import { productCategories } from '@/seeds/productCategories';
import { Button } from '@/components/atoms/button/Button';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { useRouter } from 'next/router';
import { fetcher } from '@/lib/api';
import { useUserContext } from '@/contexts/UserContext';

export const Form = ({ product, setProduct }) => {
  const { user } = useUserContext();
  const router = useRouter();
  const discountRef = useRef(null);
  const { showPopup } = usePopupContext();

  const integerfields = ['quantity'];
  const decimalFields = ['price', 'discountedPrice'];

  const handleChange = (e) => {
    const field = e.target.id;
    if (integerfields.includes(field)) {
      setProduct((product) => ({
        ...product,
        [field]: e.target.valueAsNumber,
      }));
      return;
    }
    if (decimalFields.includes(field)) {
      setProduct((product) => ({
        ...product,
        [field]: parseFloat(e.target.value),
      }));
      return;
    }
    setProduct((product) => ({ ...product, [field]: e.target.value }));
  };

  const toggleDiscount = (e) => {
    setProduct((product) => ({
      ...product,
      discountedPrice: 0,
      promoting: e.target.checked,
    }));
    if (!e.target.checked) {
      discountRef.current.value = null;
      discountRef.current.disabled = true;
    } else {
      discountRef.current.disabled = false;
    }
  };

  const getFinalProduct = (product) => {
    return {
      name: product.name,
      price: product.price,
      totalQuantity: product.quantity,
      img: [product.img.preview],
      sellerId: user.id,
    };
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!product.img?.file) {
      showPopup(popupStates.WARNING, 'Please upload an image for the product');
      return;
    }
    if (product.promoting && product.discountedPrice >= product.price) {
      showPopup(
        popupStates.WARNING,
        'Discounted price must be less than price'
      );
      return;
    }
    const finalProduct = getFinalProduct(product);
    fetcher({
      url: '/products',
      token: user?.accessToken,
      method: 'POST',
      body: finalProduct,
    })
      .then((data) => {
        console.log({ data });
        // TODO: get id from response
        showPopup(popupStates.SUCCESS, 'Product created successfully');
        router.push(`/products/${data.id}`);
      })
      .catch((error) => {
        console.log(error);
        showPopup(popupStates.ERROR, error.message);
      });
  };

  return (
    <form className={styles.form} onSubmit={submitForm}>
      <div className={styles.metaRow}>
        <div className={styles.col}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              required
              id="name"
              value={product.name}
              onChange={handleChange}
            />
            <p className={styles.errorMessage}></p>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="price">Price</label>
            <div className={styles.iconInput}>
              <div className={styles.iconContainer}>
                <Image src={dollor} alt="dollor" />
              </div>
              <input
                className={styles.iconInputField}
                required
                type="text"
                id="price"
                data-value-as-number={product.price}
                onChange={handleChange}
              />
            </div>
            <div className={styles.discount}>
              <input
                type="checkbox"
                name="promoting"
                id="promoting"
                value={product.discount}
                onChange={toggleDiscount}
              />
              <label htmlFor="promoting">Discounted price: </label>
              <div className={styles.iconInput}>
                <div className={styles.iconContainer}>
                  <Image src={dollor} alt="dollor" />
                </div>
                <input
                  className={styles.iconInputField}
                  ref={discountRef}
                  type="text"
                  id="discountedPrice"
                  data-value-as-number={product.discountedPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              required
              id="quantity"
              data-value-as-number={product.quantity}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              value={product.id}
              onChange={handleChange}
            >
              {productCategories.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              required
              id="address"
              value={product.address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className={styles.col}>
          <ImageInput
            image={product.img}
            updateImage={(img) =>
              setProduct((product) => ({ ...product, img }))
            }
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">Publish</Button>
      </div>
    </form>
  );
};
