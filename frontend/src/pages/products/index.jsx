import styles from './Products.module.css';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SortAndFilter } from '@/components/organisms/sortAndFilter/SortAndFilter';
// import { useUserContext } from '@/contexts/UserContext';

const Products = () => {
  // const { user } = useUserContext();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const { push, query } = useRouter();

  useEffect(() => {
    if (!query.page) {
      push({ query: { ...query, page: 1 } }, undefined, { shallow: true });
    }
    // console.log(user.accessToken);
    const url =
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?` +
      new URLSearchParams({
        search: query.search || '',
        sort: query.sort || '',
        // category: query.category || '',
        page,
      });
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, [query, page, push]);

  const updateUrlParams = (key, value) => {
    const newQuery = Object.entries({ ...query, [key]: value }).reduce(
      (acc, [k, val]) => {
        if (!val) return acc;
        return { ...acc, [k]: val };
      },
      {}
    );
    push({ query: newQuery }, undefined, { shallow: true });
  };

  useEffect(() => {
    updateUrlParams('page', page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
            disabled={page === 1}
            className={styles.previous}
            onClick={() => setPage((page) => page - 1)}
          >
            «
          </button>
          <span>Page {page}</span>
          {/* TODO: disable next button if it's the last page */}
          <button
            className={styles.next}
            onClick={() => setPage((page) => page + 1)}
          >
            »
          </button>
        </div>
      </div>
    </main>
  );
};

export default Products;
