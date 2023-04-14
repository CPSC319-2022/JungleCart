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
import { usePendingOrder } from '@/hooks/usePendingOrder';

const Cart = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { data: items, loading, error } = useCart();
  const { showPopup } = usePopupContext();

  const { data: pendingOrder } = usePendingOrder();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (error || !items) return;
    Promise.all(
      items.map((item) => {
        return fetcher({ url: `/products/${item.id}` });
      })
    ).then((products) => {
      const outOfStockWarning = items.reduce((warning, item, index) => {
        if (products[index].totalQuantity == 0) {
          return warning + `${item.name} is out of stock. `;
        }
        if (item.quantity > products[index].totalQuantity) {
          return (
            warning +
            `${item.name} has only ${products[index].totalQuantity} left. `
          );
        }
        return warning;
      }, '');
      if (outOfStockWarning) {
        showPopup(popupStates.WARNING, outOfStockWarning);
      }
      const newProducts = items
        .map((item, index) => ({
          ...item,
          quantity: Math.min(item.quantity, products[index].totalQuantity),
        }))
        .filter((item) => item.quantity > 0);
      fetcher({
        url: `/carts/${user.id}/items`,
        token: user.token,
        method: 'PUT',
        body: {
          user_id: user.id,
          cart_items: newProducts,
        },
      });
      setProducts(
        newProducts.map((item, index) => ({
          ...item,
          totalQuantity: products[index].totalQuantity,
        }))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, items]);

  const getTotalPrice = () => {
    const total = products?.reduce((acc, product) => {
      return acc + product.discount * product.quantity;
    }, 0);
    return total;
  };

  const updateCart = (id, quantity) => {
    const newProducts = products.map((product) => {
      if (product.id == id) {
        return { ...product, quantity };
      } else {
        return product;
      }
    });
    const productsWithoutQuantity = newProducts.map((product) => {
      const { totalQuantity, ...rest } = product;
      console.log(totalQuantity);
      return rest;
    });
    fetcher({
      url: `/carts/${user.id}/items`,
      token: user.token,
      method: 'PUT',
      body: {
        user_id: user.id,
        cart_items: productsWithoutQuantity,
      },
    }).then(() => {
      setProducts(newProducts);
    });
  };

  const handleOnIncrement = (id) => {
    const product = products.find((product) => product.id == id);
    if (product.quantity >= product.totalQuantity) {
      showPopup(
        popupStates.WARNING,
        `${product.name} has only ${product.totalQuantity} left.`
      );
      return;
    }
    updateCart(id, product.quantity + 1);
  };
  const handleOnDecrement = (id) => {
    const product = products.find((product) => product.id == id);
    if (product.quantity == 1) {
      handleDelete(id);
    } else {
      updateCart(id, product.quantity - 1);
    }
  };

  const handleDelete = (id) => {
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
      url: `/orders/users/${user.id}`,
      token: user.accessToken,
      method: 'POST',
    }).then((res) => {
      if (res.Payload.statusCode == 400) {
        const payload = JSON.parse(res.Payload.body);
        showPopup(popupStates.ERROR, payload.error);
        return;
      }

      router.push('/checkout');
    });
  };

  const viewPendingOrder = () => {
    router.push('/checkout');
  };

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

  if (pendingOrder && (!products || products.length == 0))
    return (
      <main>
        <section>
          <div className={styles.pendingOrderContainer}>
            <p>You have a pending order</p>
            <Button
              style={{ fontSize: '1rem', padding: '4px' }}
              onClick={viewPendingOrder}
            >
              View Pending Order
            </Button>
          </div>
        </section>
      </main>
    );

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
                        {'$ ' + product.discount.toFixed(2)}
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
              <div className="flex justify-between my-4">
                <div className="font-bold">TOTAL</div>
                <div className="font-bold">${getTotalPrice().toFixed(2)}</div>
              </div>
              {pendingOrder ? (
                <Button
                  style={{ fontSize: '1rem', padding: '4px' }}
                  onClick={viewPendingOrder}
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
