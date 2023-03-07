import React from 'react';
import styles from './TransactionTable.module.css';

const TransactionTable = () => {
  const transactions = [
    {
      product: 'Product 1',
      id: 1,
      price: 10,
      quantity: 2,
      date: new Date(),
    },
    {
      product: 'Product 2',
      id: 2,
      price: 115,
      quantity: 1,
      date: new Date(),
    },
    {
      product: 'Product 3',
      id: 3,
      price: 10,
      quantity: 1,
      date: new Date(),
    },
  ];
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr className={styles.header}>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Transaction Date</th>
          </tr>
          {transactions.map(({ product, id, quantity, price, date }) => (
            <tr key={id} className={styles.row}>
              <td>{product}</td>
              <td>{quantity}</td>
              <td>{price}</td>
              <td>{quantity * price}</td>
              <td>{date.toLocaleDateString('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
