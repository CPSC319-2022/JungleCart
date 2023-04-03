import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Cart.module.css';
import Separator from '@/components/atoms/separator/Separator';
import { Counter } from '@/components/atoms/counter/Counter';
import trash from '@/assets/trash.svg';
import emptybox from '@/assets/empty-box.svg';
import { Button } from '@/components/atoms/button/Button';
import { Pulser } from '@/components/atoms/pulser/Pulser';
import { useUserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/router';
import { fetcher } from '@/lib/api';
import { useCart } from '@/hooks/useCart';
import { popupStates, usePopupContext } from '@/contexts/PopupContext';
import { FREEZE_TIME } from '@/lib/constants';
import { useRemainingCheckoutTime } from '@/hooks/useRemainingCheckoutTime';

const Cart = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { data: items, loading, error } = useCart();
  const { showPopup } = usePopupContext();

  const [products, setProducts] = useState([]);
  const { remainingCheckoutTime } = useRemainingCheckoutTime();

  useEffect(() => {
    if (error) return;
    setProducts(items);
  }, [error, items]);

  const getTotalPrice = () => {
    const total = products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    return total;
  };

  const updateCart = (id, quantity) => {
    if (remainingCheckoutTime > 0) {
      showPopup(popupStates.ERROR, 'You cannot edit your cart now.');
      return;
    }
    const newProducts = products.map((product) => {
      if (product.id == id) {
        return { ...product, quantity: product.quantity + quantity };
      } else {
        return product;
      }
    });
    fetcher({
      url: `/carts/${user.id}/items`,
      token: user.token,
      method: 'PUT',
      body: {
        user_id: user.id,
        cart_items: newProducts,
      },
    }).then(() => {
      setProducts(newProducts);
    });
  };

  const handleOnIncrement = (id) => {
    updateCart(id, 1);
  };
  const handleOnDecrement = (id) => {
    if (products.filter((product) => product.id == id)[0].quantity == 1) {
      handleDelete(id);
    } else {
      updateCart(id, -1);
    }
  };

  const handleDelete = (id) => {
    if (remainingCheckoutTime > 0) {
      showPopup(popupStates.ERROR, 'You cannot edit your cart now.');
      return;
    }
    const newProducts = products.filter((product) => product.id != id);
    fetcher({
      url: `/carts/${user.id}/items/${id}`,
      token: user.token,
      method: 'DELETE',
    }).then(() => {
      showPopup(popupStates.SUCCESS, 'Product successfully deleted.');
      setProducts(newProducts);
    });
  };

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const checkout = () => {
    fetcher({
      url: `/orders`,
      token: user.accessToken,
      method: 'POST',
      body: { userId: user.id },
    });
    // .then((res) => {
    //   console.log({ res });
    //   router.push('/checkout');
    //   const lastCheckoutTime = window.localStorage.getItem('checkoutTime');
    //   if (lastCheckoutTime) {
    //     const timeDiff = new Date().getTime() - lastCheckoutTime;
    //     if (timeDiff < FREEZE_TIME) {
    //       localStorage.setItem('checkoutTime', lastCheckoutTime);
    //       return;
    //     }
    //     localStorage.removeItem('checkoutTime');
    //   }
    //   localStorage.setItem('checkoutTime', new Date().getTime());
    // });
    push('/checkout');
    const lastCheckoutTime = window.localStorage.getItem('checkoutTime');
    if (lastCheckoutTime) {
      const timeDiff = new Date().getTime() - lastCheckoutTime;
      if (timeDiff < FREEZE_TIME) {
        localStorage.setItem('checkoutTime', lastCheckoutTime);
        return;
      }
      localStorage.removeItem('checkoutTime');
    }
    localStorage.setItem('checkoutTime', new Date().getTime());
  };

  const shippingCost = getTotalPrice() > 50 ? 0 : 10;
  const tax = getTotalPrice() * 0.12;

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

  if (!products || products.length == 0) {
    return (
      <main>
        <section>
          <div className="flex w-full justify-center align-middle text-center gap-6">
            <Image src={emptybox} alt="" />
            <h1 className="text-3xl mt-auto mb-auto">Cart is empty</h1>
          </div>
          <div className="w-full flex justify-center mt-10">
            <Button onClick={() => router.push('/products')}>Browse</Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <div className={styles.top_container}>
          <h2 className="section-header">Cart</h2>
        </div>
        <Separator />
        <div className="overflow-y-auto w-full">
          <table className="table w-full h-10">
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product.id} className="flex w-full">
                    <td className="grow font-bold flex items-center">
                      <p
                        className={styles.productname}
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.name}
                      </p>
                    </td>
                    <td className="flex gap-7">
                      <div>
                        <Counter
                          onIncrement={() => handleOnIncrement(product.id)}
                          onDecrement={() => handleOnDecrement(product.id)}
                          value={product.quantity}
                        />
                      </div>
                      <div
                        className="m-auto cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Image src={trash} alt="trash" />
                      </div>
                      <div className={styles.price}>
                        {'$ ' + product.price.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Separator />
          <div className="flex justify-end">
            <div className="flex flex-col w-40">
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>${shippingCost}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>${tax.toFixed(2)}</div>
              </div>
              <div className="flex justify-between">
                <div>Sub Total</div>
                <div>${getTotalPrice().toFixed(2)}</div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="font-bold">TOTAL</div>
                <div className="font-bold">
                  ${(getTotalPrice() + shippingCost + tax).toFixed(2)}
                </div>
              </div>
              {remainingCheckoutTime > 0 ? (
                <Button
                  style={{ fontSize: '1rem', padding: '4px' }}
                  onClick={checkout}
                >
                  View Pending Order
                </Button>
              ) : (
                <Button onClick={checkout}>Checkout</Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Cart;
