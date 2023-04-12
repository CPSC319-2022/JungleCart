import styles from './Products.module.css';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SortAndFilter } from '@/components/organisms/sortAndFilter/SortAndFilter';
import { fetcher } from '@/lib/api';
import { Pulser } from '@/components/atoms/pulser/Pulser';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { push, query } = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.page) {
      push({ query: { ...query, page: 1 } }, undefined, { shallow: true });
      return;
    }
    const params = new URLSearchParams({
      search: query.search || '',
      order_by: query.order_by || '',
      order_direction: query.order_direction || '',
      category: query.category || '',
      page: query.page || 1,
    });
    setLoading(true);
    fetcher({ url: `/products?${params}` }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [query, push]);

  const updateUrlParams = (queries) => {
    const queryDict = queries.reduce((dict, obj) => ({ ...dict, ...obj }), {});
    const newQuery = Object.entries({ ...query, ...queryDict }).reduce(
      (acc, [k, val]) => {
        if (!val) return acc;
        return { ...acc, [k]: val };
      },
      {}
    );
    push({ query: newQuery }, undefined, { shallow: true });
  };

  const pageNumber = query.page ? parseInt(query.page) : 1;

  if (loading) {
    return (
      <main>
        <section>
          <Pulser />
          <Pulser />
          <Pulser />
        </section>
      </main>
    );
  }

  return (
    <main>
      <SortAndFilter updateUrlParams={updateUrlParams} />
      <div className=" max-w-7xl grid grid-cols-auto md:grid-cols-3 lg:grid-cols-4 gap-4 gap-x-2 shadow-sm">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="flex w-full justify-center p-5">
        <div className={styles.buttonGroup}>
          <button
            disabled={pageNumber === 1}
            className={styles.previous}
            onClick={() => updateUrlParams([{ page: pageNumber - 1 }])}
          >
            «
          </button>
          <span>Page {pageNumber}</span>
          <button
            disabled={products.length < 10}
            className={styles.next}
            onClick={() => updateUrlParams([{ page: pageNumber + 1 }])}
          >
            »
          </button>
        </div>
      </div>
    </main>
  );
};

export default Products;
