import React from 'react';
import Image from 'next/image';
import styles from '../../styles/Products.module.css';
import { useRouter } from 'next/router';
import { products } from '@/seeds/products';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import Separator from '@/components/atoms/separator/Separator';
import categoriesIcon from '../../assets/categories.svg';
import sortIcon from '../../assets/sort.svg';

const Products = () => {
  return <main className={styles.mainContainer}>
    <div className={styles.controls}>
      <button>
        <p>Sort</p>
        <Image src={sortIcon} alt=""/>
      </button>
      <button>
        <p>Categories</p>
        <Image src={categoriesIcon} alt=""/>
      </button>
    </div>
    <Separator />
    <div className={styles.productGridContainer}>
      {products.products.map(product => (<ProductCard key={product.id} {...product} />))}
    </div>
  </main>
}

export default Products

