import { useState } from "react"
import emptybox from '@/assets/empty-box.svg';
import { Pulser } from "@/components/atoms/pulser/Pulser"
import trashIcon from "@/assets/trash.svg"
import Image from "next/image"
import styles from "./OrdersTable.module.css"
import { useOrders } from "@/hooks/useOrders"
import { useRouter } from "next/router";
import EditOrderModal from "../modals/EditOrderModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { fetcher } from "@/lib/api";
import { usePopupContext, popupStates } from "@/contexts/PopupContext";

const OrdersTable = () => {
    const {orders, loading, error, triggerFetch} = useOrders();

    const router = useRouter();
    const { showPopup } = usePopupContext();

    const [focusedOrder, setFocusedOrder] = useState({});
    const [showEditOrderModal, setShowEditOrderModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);


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

    const onDelete = (order_id) => {
        console.log(order_id)
        setFocusedOrder(orders?.filter((order => order.id == order_id))[0])
        setShowConfirmationModal(true)
    }

    const handleOnDeleteSubmit = (order_id) => {
        fetcher({
            url: `/orders/${order_id}`,
            method: "DELETE"
        }).then(() => {
            triggerFetch();
            showPopup(popupStates.SUCCESS, 'Deleted Order!'); 
        }).catch((error) => {
            console.log(error)
            // showPopup(popupStates.ERROR, error.message);
            triggerFetch();
        })
    }

    const onEditStatus = (order_id) => {
        setFocusedOrder(orders?.filter((order => order.id == order_id))[0])
        setShowEditOrderModal(true)
    }

    const handleOnEditSubmit = (status, order_id) => {
        setShowEditOrderModal(false)
        setFocusedOrder({})
        console.log(status, order_id)
        fetcher({
            url: `/orders/${order_id}`,
            method: "PUT",
            body: {
                orderStatus: status
            }
        }).then(() => {
            triggerFetch();
            showPopup(popupStates.SUCCESS, 'Changed Status Order!'); 
        }).catch((error) => {
            showPopup(popupStates.ERROR, error.message);
            triggerFetch();
        })
    }

    if(loading){
        return(
            <Pulser />
        )
    }

    if(orders?.length == 0){
        return(
            <>
                <div className="flex w-full justify-center align-middle text-center gap-6">
                    <Image src={emptybox} alt="" />
                    <h1 className="text-3xl mt-auto mb-auto">No orders for you!</h1>
                </div>
                <div className="w-full flex justify-center mt-10">
                    <button onClick={() => router.push('/products')} className="btn btn-primary">Browse</button>
                </div>
            </>
        )
    }

    return(
        <>
        
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
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {orders?.map((order) => {
                    return(
                        <tr key={order.id}>
                            <th className={styles.static_first_child}>{order.id}</th>
                            <td>{convertDateFormat(order.created_at)}</td>
                            <td>{`${getTotalItems(order)} items`}</td>
                            <td>{`$${getTotalPrice(order)}`}</td>
                            <td>{order.status_label}</td>
                            <td>
                                <label htmlFor="edit-order" onClick={() => onEditStatus(order.id)} className="btn">change status</label>
                            </td>
                            <td>
                                <Image src={trashIcon} alt="delete" className="cursor-pointer" onClick={() => onDelete(order.id)}/>
                            </td>   
                        </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
            
            <EditOrderModal initialOrder={focusedOrder} onSubmit={handleOnEditSubmit} 
            toggle={() => {
                setShowEditOrderModal(false)
                setFocusedOrder({})
                }} />
            <ConfirmationModal show={showConfirmationModal} toggle={() => setShowConfirmationModal(false)} 
            onApprove={() => handleOnDeleteSubmit(focusedOrder?.id)} />
            </>
    )
}

export default OrdersTable