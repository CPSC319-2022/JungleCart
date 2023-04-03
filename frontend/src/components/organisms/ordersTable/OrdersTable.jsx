import { useState, useEffect } from "react"
import trashIcon from "@/assets/trash.svg"
import Image from "next/image"
import styles from "./OrdersTable.module.css"

const OrdersTable = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
        const params = new URLSearchParams({
            order_by: "created_at",
            order_dir: "asc"
        });
        //TODO change url to use current user and env backend url, probably use a custom useOrders hook.
        return await fetch(`https://bs1qwjk3hh.execute-api.eu-central-1.amazonaws.com/dev/orders/users/2?${params}`,{
            headers: {
            'Content-Type': 'application/json',
            }
        })
        }
        fetchOrders()
        .then((res) => res.json())
        .then((data) => setOrders(data))
    }, [])

    const convertDateFormat = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // getMonth() returns 0-indexed month
        const day = date.getDate();
        const year = date.getFullYear();
        const formattedDate = `${month}-${day}-${year}`;
        return formattedDate
    }
    const getTotalPrice = (order) => {
        let totalPrice = 0;
        for (let i = 0; i < order.products.length; i++) {
            const product = order.products[i];
            totalPrice += product.product_price * product.quantity;
        }
        return totalPrice;
    }

    const getTotalItems = (order) => {
        let total_quantity = 0;
        for (let i = 0; i < order.products.length; i++) {
            const product = order.products[i];
            total_quantity += product.quantity;
        }
        return total_quantity;
    }

    return(
        <div className="overflow-x-auto overflow-y-scroll h-96">
            <table className="table table-zebra w-full">
                {/* head */}
                <thead>
                <tr>
                    <th className={styles.static_first_child}>Order Id</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => {
                    return(
                        <tr key={order.id}>
                            <th className={styles.static_first_child}>{order.id}</th>
                            <td>{convertDateFormat(order.created_at)}</td>
                            <td>{`${getTotalItems(order)} items`}</td>
                            <td>{`$${getTotalPrice(order)}`}</td>
                            <td>{order.status_label}</td>
                            <td>
                                <div className="avatar cursor-pointer">
                                    <Image src={trashIcon} alt="delete"/>
                                </div>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
    )
}

export default OrdersTable