import { useRouter } from 'next/router';
import { productCategories } from '@/seeds/productCategories';
import styles from './SortAndFilter.module.css';

export const SortAndFilter = ({ updateUrlParams }) => {
  const { query } = useRouter();
  const toSnakeCase = (str) => {
    return str.toLowerCase().replaceAll(' ', '_');
  };

  const sortByCheapest = () => {
    updateUrlParams([{ order_by: 'price' }, { order_direction: 'ASCEND' }]);
  };

  const sortByRecent = () => {
    updateUrlParams([
      { order_by: 'created_at' },
      { order_direction: 'DESCEND' },
    ]);
  };

  return (
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
            <button
              onClick={sortByCheapest}
              className={query.sort === 'cheapest' ? styles.active : ''}
            >
              Cheapest
            </button>
          </li>
          <li>
            <button
              onClick={sortByRecent}
              className={query.sort === 'recent' ? styles.active : ''}
            >
              Most Recent
            </button>
          </li>
        </ul>
      </div>

      <div className="dropdown dropdown-hover">
        <label
          tabIndex={0}
          className="btn hover:bg-transparent bg-transparent border-0 border-b border-b-primary  text-black min-h-fit h-fit p-3 rounded-none"
        >
          Category
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <button
              onClick={() => updateUrlParams('category', '')}
              className={!query.category ? styles.active : ''}
            >
              All
            </button>
          </li>
          {productCategories.categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() =>
                  updateUrlParams('category', toSnakeCase(category.name))
                }
                className={
                  query.category === toSnakeCase(category.name)
                    ? styles.active
                    : ''
                }
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
