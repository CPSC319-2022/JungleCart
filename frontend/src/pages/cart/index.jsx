import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Cart.module.css";
import Separator from "@/components/atoms/separator/Separator";
import emptybox from "@/assets/empty-box.svg";
import { Button } from "@/components/atoms/button/Button";
import { Pulser } from "@/components/atoms/pulser/Pulser";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { popupStates, usePopupContext } from "@/contexts/PopupContext";
import { usePendingOrder } from "@/hooks/usePendingOrder";
import Link from "next/link";

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
      }, "");
      if (outOfStockWarning) {
        showPopup(popupStates.WARNING, outOfStockWarning);
      }
      const newProducts = items
        .map((item, index) => ({
          ...item,
          quantity: Math.min(item.quantity, products[index].totalQuantity)
        }))
        .filter((item) => item.quantity > 0);
      fetcher({
        url: `/carts/${user.id}/items`,
        token: user.token,
        method: "PUT",
        body: {
          user_id: user.id,
          cart_items: newProducts
        }
      });
      setProducts(
        newProducts.map((item, index) => ({
          ...item,
          totalQuantity: products[index].totalQuantity
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
      method: "PUT",
      body: {
        user_id: user.id,
        cart_items: productsWithoutQuantity
      }
    }).then(() => {
      setProducts(newProducts);
    });
  };


  const handleChange = (id, updatedTotal) => {
    const product = products.find((product) => product.id == id);
    if (updatedTotal >= product.totalQuantity) {
      showPopup(
        popupStates.WARNING,
        `${product.name} has only ${product.totalQuantity} left.`
      );
      return;
    }
    if (isNaN(updatedTotal) || updatedTotal <= 0) {
      showPopup(
        popupStates.WARNING,
        "Quantity should be a positive whole number."
      );
      return;
    }

    if (Math.floor(Number(updatedTotal)) !== Number(updatedTotal)) {
      showPopup(
        popupStates.WARNING,
        "Quantity cannot have fractions"
      );
      return;
    }
    updateCart(id, Number(updatedTotal));
  };

  const handleDelete = (id) => {
    const newProducts = products.filter((product) => product.id != id);
    fetcher({
      url: `/carts/${user.id}/items/${id}`,
      token: user.token,
      method: "DELETE"
    }).then(() => {
      showPopup(popupStates.SUCCESS, "Product successfully deleted.");
      setProducts(newProducts);
    });
  };


  const checkout = () => {
    fetcher({
      url: `/orders/users/${user.id}`,
      token: user.accessToken,
      method: "POST"
    }).then((res) => {
      if (res.Payload.statusCode == 400) {
        const payload = JSON.parse(res.Payload.body);
        showPopup(popupStates.ERROR, payload.error);
        return;
      }

      router.push("/checkout");
    });
  };

  const viewPendingOrder = () => {
    router.push("/checkout");
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
              style={{ fontSize: "1rem", padding: "4px" }}
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
            <Button onClick={() => router.push("/products")}>Browse</Button>
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

        <div className={"card bg-gray-light p-2 rounded-md w-full"}>
          <div className={"flex gap-x-2 py-1 items-center "}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 className="stroke-current flex-shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className={"text-sm"}>
              Items in your cart can be sold out or modified at any point. but don&apos;t worry we will prevent you from
              moving onto checkout if that case happens
            </p>
          </div>
        </div>

        <div className={"card bg-gray-light p-2 rounded-md w-full"}>
          <div className={"flex gap-x-2 py-1 items-center "}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 className="stroke-current flex-shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className={"text-sm"}>
              Easily modify a product in your cart by either clicking on trash icon to delete, or click on the quantity
              bubble to edit the quantity. You can discard the change by clicking on the X icon or apply the change by
              clicking the check icon. </p>
          </div>
        </div>

        <Separator />

        <div className="overflow-x-auto">
          <table className="table table-compact w-full shadow-2xl border border-base-200 border-b-0">
            <thead className={"rounded-2xl"}>
            <tr className={"[&>th]:rounded-sm"}>
              <th>id</th>
              <th>Product</th>
              <th>Price Per each</th>
              <th>Count</th>
              <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => {
              return (
                <CartItem key={product.id} product={product} handleDelete={handleDelete} handleChange={handleChange} />
              );
            })}
            <tr className={"border-b border-base-200 "}>
              <td></td>
              <td></td>
              <td></td>
              <td className={"flex justify-start border-l border-base-200 text-center h-full bg-base-200 "}>
                <div className={" pl-3  w-fit h-full font-black text-md bg-base-200 "}>
                  TOTAL
                </div>
              </td>
              <td
                className="font-black text-md bg-base-200 rounded-sm text-primary-dark">${getTotalPrice().toFixed(2)}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-y-auto w-full">
          <Separator />
          <div className="flex justify-end">
            <div className="flex flex-col w-40">
              {pendingOrder ? (
                <Button
                  style={{ fontSize: "1rem", padding: "4px" }}
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
        <Separator />
        <div className={"card bg-gray-light p-2 rounded-md w-full"}>
          <div className={"flex gap-x-2 py-1 items-center "}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 className="stroke-current flex-shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className={"text-sm"}>
              The total does not include any shipping and tax fees that may be applied based on your location
            </p>
          </div>
        </div>

        <Separator />
        <div className={"flex gap-x-2 py-1 items-center"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" className="inline-block w-8 h-8 ">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <p className={"text-xs "}>To provide even more flexibility, we have plans to incorporate bulk editing</p>
        </div>
      </section>
    </main>
  );
};

export default Cart;

const CartItem = ({ product, handleDelete, handleChange }) => {
  const [tempQuantity, setTempQuantity] = useState(product.quantity);

  const isUnchaged = () => {
    return !isNaN(tempQuantity) && Number(tempQuantity) === product.quantity;
  };

  useEffect(() => {

    setTempQuantity(product.quantity);
  }, [product.quantity]);

  return (
    <tr key={product.id} className="">
      <th className={"border-r border-b border-base-200"}>
        {product.id}
      </th>

      <td>
        <Link
          className="underline text-sm text-primary-dark"
          href={`/products/${product.id}`}
        >
          {product.name}
        </Link>
      </td>
      <td>
        <div className={styles.price}>
          {`$${product.discount.toFixed(2)}/ea`}
        </div>
      </td>
      <td className={"py-2 "}>
        <div className={"flex gap-x-3 rounded-2xl bg-primary border border-primary p-0 w-[200px]"}>
          {isUnchaged() &&
            <div
              className="m-auto cursor-pointer px-2"
              onClick={() => handleDelete(product.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                   className="stroke-current flex-shrink-0 w-6 h-6">
                <path d="M4 7H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10"
                  stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>}

          {!isUnchaged() &&
            <div
              className="m-auto cursor-pointer px-2 "
              onClick={() => setTempQuantity(product.quantity)}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                   className="stroke-current flex-shrink-0 w-6 h-6">
                <path d="M9 9L15 15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 9L9 15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" />

              </svg>
            </div>}

          <input type="number"
                 value={tempQuantity}
                 onChange={(e) => {
                   setTempQuantity(e.target.value);
                 }}
                 className="input h-fit py-1 grow w-fit card rounded-2xl   border-primary based-200 text-center  place-items-center px-1 w-full " />
          {!isUnchaged() &&


            <div
              className="m-auto cursor-pointer px-2 "
              onClick={() => handleChange(product.id, tempQuantity)}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                   className="stroke-current flex-shrink-0 w-6 h-6">
                <path d="M7 13L10 16L17 9" stroke="#000000" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" />
              </svg>
            </div>

          }
        </div>

      </td>
      <td className={"border-l border-base-200"}>
        <div className={`{styles.price} text-primary-dark font-bold underline`}>
          {`$${(product.discount * product.quantity).toFixed(2)}`}
        </div>
      </td>
    </tr>


  );
};
