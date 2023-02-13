import React, { useState } from 'react'
import styles from "./Form.module.css"

export const Form = () => {
    const initialProduct = {
        name: "",
        price: 0,
        quantity: 0,
        category: "home",
        photo: null,
    }
    const [product, setProduct] = useState(initialProduct)

    const handleChange = (e) => {
        const field = e.target.id;
        if (field === "price" || field === "quantity") {
            setProduct(product => ({...product, [field]: e.target.valueAsNumber}))
            return;
        }
        if (field === "name" || field === "category") {
            setProduct(product => ({...product, [field]: e.target.value}))
            return;
        }
        if (field === "photo") {
            const file = e.target.files[0];
            console.log({file})
        }
    }

    console.log({product})

  return (
    <form className={styles.form}>
        <div className={styles.col}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={product.name} onChange={handleChange} />
                <p className={styles.errorMessage}></p>
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="price">Price</label>
                <input type="number" id="price" valueAsNumber={product.price} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="quantity">Quantity</label>
                <input type="number" id="quantity" valueAsNumber={product.quantity} onChange={handleChange} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="category">Category</label>
                <select name="category" id="category" value={product.category} onChange={handleChange}>
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="technology">Technology</option>
                    <option value="leisure">Leisure</option>
                </select>
            </div>
        </div>
        <div className={styles.col}>
            <div className={styles.inputGroup}>
                <label htmlFor="photo">Photo</label>
                <input type="file" id="photo"  value={product.photo} onChange={handleChange}/>
            </div>
            <div className={styles.photoPreview}></div>
        </div>
    </form>
  )
}
