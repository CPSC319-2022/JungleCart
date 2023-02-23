import styles from '../../styles/Products.module.css';
import { products } from '@/seeds/products';
import { ProductCard } from '@/components/organisms/productCard/ProductCard';
import { usePopupContext } from '@/contexts/PopupContext';

const Products = () => {
  const { showPopup } = usePopupContext();
  return (
    <main className={styles.mainContainer}>
      <div className="flex p-3 gap-x-5  ">
        <div className="dropdown dropdown-hover ">
          <label
            tabIndex={0}
            className="btn hover:bg-transparent bg-transparent border-0 border-b border-b-primary  text-black min-h-fit h-fit p-3 rounded-none"
          >
            Sort
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>

        <div className="dropdown dropdown-hover">
          <label
            tabIndex={0}
            className="btn hover:bg-transparent bg-transparent border-0 border-b border-b-primary  text-black min-h-fit h-fit p-3 rounded-none"
          >
            Filter
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      </div>

      <div className=" max-w-7xl grid grid-cols-auto md:grid-cols-3 lg:grid-cols-4 gap-4 gap-x-2 shadow-sm">
        {products.products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="flex w-full justify-center p-5">
        <div
          className="btn-group"
          onClick={() => showPopup('warning', 'A warning')}
        >
          <button className="btn btn-primary">«</button>
          <button className="btn btn-primary">Page 1</button>
          <button className="btn btn-primary">»</button>
        </div>
      </div>
    </main>
  );
};

export default Products;
