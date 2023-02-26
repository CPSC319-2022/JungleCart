import {ImageInput} from '@/components/atoms/imageInput/ImageInput';
import Image from 'next/image';
import React from 'react';
import styles from './Form.module.css';
import dollor from '@/assets/price.svg';

export const Form = ({ product, setProduct }) => {
  const handleChange = (e) => {
    console.log('change');
    const field = e.target.id;
    if (field === 'price' || field === 'quantity') {
      setProduct((product) => ({
        ...product,
        [field]: e.target.valueAsNumber,
      }));
      return;
    }
    if (field === 'name' || field === 'category' || field === 'description') {
      setProduct((product) => ({ ...product, [field]: e.target.value }));
      return;
    }
  };

  return (
    <form className={styles.form}>
      <div className={styles.metaRow}>
        <div className={styles.col}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
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
                type="number"
                id="price"
                data-value-as-number={product.price}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
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
              value={product.category}
              onChange={handleChange}
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="technology">Technology</option>
              <option value="leisure">Leisure</option>
            </select>
          </div>
        </div>
        <div className={styles.col}>
          <ImageInput
            image={product.photo}
            updateImage={(img) =>
              setProduct((product) => ({ ...product, photo: img }))
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
    </form>
  );
};
