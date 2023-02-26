import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Cart.module.css';
import Separator from '@/components/atoms/separator/Separator';
import { Counter } from '@/components/atoms/counter/Counter';
import { cart } from '@/seeds/cart';
import trash from '@/assets/trash.svg'
import { Button } from '@/components/atoms/button/Button';

const Cart = () => {
  const [products, setProducts] = useState(cart)

  const handleOnIncrement = (id) => {
      const newProducts = products.map((product) => {
        if(product.id == id){
          return {...product, quantity: product.quantity + 1}
        } else {
          return product
        }
      })
      setProducts(newProducts)
  }
  const handleOnDecrement = (id) => {
    const newProducts = products.map((product) => {
      if(product.id == id){
        return {...product, quantity: product.quantity - 1}
      } else {
        return product
      }
    })
    setProducts(newProducts)
  }

  const handleDelete = (id) => {
    const newProducts = products.filter((product) => product.id != id)
    setProducts(newProducts)
  }

  return (
    <main>
      <section>
        <div className={styles.top_container}>
            <h2 className="section-header">Cart</h2>
        </div>
        <Separator />
        <div className='overflow-y-auto w-full'>
          <table className='table w-full h-10'>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product.id} className='flex w-full'>
                    <td className='grow font-bold flex items-center'>{product.name}</td>
                    <td className='flex gap-7'>
                      <div>
                        <Counter onIncrement={() => handleOnIncrement(product.id)} onDecrement={() => handleOnDecrement(product.id)} value={product.quantity} />
                      </div>
                      <div className='m-auto cursor-pointer' onClick={() => handleDelete(product.id)}>
                        <Image src={trash} alt="trash"/>
                      </div>
                      <div className={styles.price}>
                        {"$ " + product.price}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Separator />
          <div className='flex justify-end'>
            <div className='flex flex-col w-40'>
                <div className='flex justify-between'>
                    <div>Shipping</div>
                    <div>$10</div>
                </div>
                <div className='flex justify-between'>
                    <div>Tax</div>
                    <div>$5</div>
                </div>
                <div className='flex justify-between'>
                    <div>Sub Total</div>
                    <div>$30</div>
                </div>
                <div className='flex justify-between mb-4'>
                    <div className='font-bold'>TOTAL</div>
                    <div className='font-bold'>$120</div>
                </div>
                <Button>Checkout</Button>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
};

export default Cart;
