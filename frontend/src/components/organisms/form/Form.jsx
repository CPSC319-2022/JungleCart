import { ImageInput } from '@/components/atoms/imageInput/ImageInput';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!product.promoting) {
      discountRef.current.disabled = true;
    }
  }, [product.promoting]);

  const integerfields = ['totalQuantity', 'categoryId'];
  const decimalFields = ['price', 'discountedPrice'];

  const handleChange = (e) => {
    const field = e.target.id;
    if (integerfields.includes(field)) {
      setProduct((product) => ({
        ...product,
        [field]: parseInt(e.target.value),
      }));
      return;
    }
    if (decimalFields.includes(field)) {
      setProduct((product) => ({
        ...product,
        [field]: e.target.value,
      }));
      return;
    }
    setProduct((product) => ({ ...product, [field]: e.target.value }));
  };

  const toggleDiscount = (e) => {
    setProduct((product) => ({
      ...product,
      discountedPrice: product.price || 0,
      promoting: e.target.checked,
    }));
    if (!e.target.checked) {
      discountRef.current.value = null;
      discountRef.current.disabled = true;
    } else {
      discountRef.current.disabled = false;
    }
  };

  const getProductImage = () => {
    if (!product.img) return null;
    if (product.img?.file) {
      return [
        {
          data: product.img.preview.split(',')[1],
          type: product.img.file.type,
        },
      ];
    }
    if (product.img?.id) {
      return [{ id: product.img.id }];
    }
  };

  const getFinalProduct = (product) => {
    const productImage = getProductImage();
    return {
      name: product.name,
      price: +product.price,
      totalQuantity: +product.totalQuantity,
      ...(productImage ? { img: productImage } : { img: [] }),
      sellerId: user.id,
      address: product.address,
      description: product.description,
      categoryId: product.categoryId,
      discount: product.promoting ? +product.discountedPrice : +product.price,
    };
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (product.promoting && +product.discountedPrice > +product.price) {
      showPopup(
        popupStates.WARNING,
        'Discounted price must be less than price'
      );
      return;
    }
    const finalProduct = getFinalProduct(product);
    console.log({ finalProduct });
    const isEdit = router.pathname.endsWith('/edit');
    fetcher({
      url: isEdit ? `/products/${router.query.productId}` : '/products',
      token: user?.accessToken,
      method: isEdit ? 'PATCH' : 'POST',
      body: finalProduct,
    })
      .then((data) => {
        showPopup(
          popupStates.SUCCESS,
          `Product ${isEdit ? 'updated' : 'created'} successfully`
        );
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
                type="number"
                step={0.01}
                id="price"
                value={product.price}
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
                  type="number"
                  step={0.01}
                  id="discountedPrice"
                  value={product.discountedPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="totalQuantity">Quantity</label>
            <input
              type="number"
              required
              id="totalQuantity"
              value={product.totalQuantity}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="categoryId"
              value={product.categoryId}
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
