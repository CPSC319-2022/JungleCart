import Image from 'next/image';
import {useRouter} from 'next/router';

export const ProductCard = ({ img, price, name, id }) => {
  const router = useRouter();

  return (
    <div className="card  hover:shadow-lg rounded-md p-2 shadow-md bg-gray-light   ">
      <div className=" relative md:container h-60  p-5">
        <figure>
          {' '}
          <Image
            className=" object-scale-down p-5"
            src={img[0]}
            alt={name}
            fill
            onClick={() => router.push(`/products/${id - 1}`)}
          />
        </figure>
      </div>
      <div className="card-body p-1 justify-between pb-1 border-base-100  border-t">
        <div
          className="tooltip tooltip-closed tooltip-top tooltip-primary text-left"
          data-tip={name}
        >
          <h2 className={' text-black text-xs card-title  w-full line-clamp-2'}>
            {name}
          </h2>
        </div>
        <div className="card-actions justify-end">
          <p className={'text-sm font-bold'}>${price}</p>
          <button className="text-primary h-fit text-sm font-bold min-h-0">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
