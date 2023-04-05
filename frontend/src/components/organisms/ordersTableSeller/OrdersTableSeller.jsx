import { useState, useEffect } from "react"
import emptybox from '@/assets/empty-box.svg';
import { Pulser } from "@/components/atoms/pulser/Pulser"
import trashIcon from "@/assets/trash.svg"
import Image from "next/image"
import styles from "../ordersTableBuyer/OrdersTable.module.css"
// import { useOrders } from "@/hooks/useOrders"
import { useRouter } from "next/router";
import EditOrderModal from "../modals/EditOrderModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { fetcher } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { usePopupContext, popupStates } from "@/contexts/PopupContext";

const OrdersTableSeller = ({user_id}) => {

    const {data: orders, loading, triggerFetch} = useFetch(`/orders/sellers/${user_id}`);
    // useEffect(() => {
    //     console.log(orders)
    // }, [orders])

    const router = useRouter();
    const { showPopup } = usePopupContext();

    const [focusedOrder, setFocusedOrder] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);


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
    }

    const handleOnEditSubmit = (status, order_id, order_item_id) => {
        setFocusedOrder({})
        console.log(status, order_id, order_item_id)
        // fetcher({
        //     url: `/orders/${order_id}/items/${order_item_id}`,
        //     method: "POST",
        //     body: {
        //         status: status
        //     }
        // }).then(() => {
        //     triggerFetch();
        //     showPopup(popupStates.SUCCESS, 'Changed Status Order!'); 
        // }).catch((error) => {
        //     showPopup(popupStates.ERROR, error.message);
        //     triggerFetch();
        // })
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
                    <th className={styles.static_first_child}>Order Item Id</th>
                    <th>Buyer</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Shipping Status</th>
                    <th></th>
                    {/* <th></th> */}
                </tr>
                </thead>
                <tbody>
                {orders?.map((order) => {
                    return(
                        <tr key={order.id}>
                            <th className={styles.static_first_child}>{order.id}</th>
                            <td>{`${order.buyer_info.first_name} ${order.buyer_info.last_name}`}</td>
                            <td>{`${order.name}`}</td>
                            <td>{`${order.quantity}`}</td>
                            {/* <td>{`$${getTotalPrice(order)}`}</td> */}
                            <td>{order.status}</td>
                            <td>
                                <label htmlFor="edit-order" onClick={() => onEditStatus(order.id)} className="btn">change status</label>
                            </td>
                            {/* <td>
                                <Image src={trashIcon} alt="delete" className="cursor-pointer" onClick={() => onDelete(order.id)}/>
                            </td>    */}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
            
            <EditOrderModal initialOrder={focusedOrder} onSubmit={handleOnEditSubmit} isSeller={true}
            toggle={() => {
                setFocusedOrder({})
                }} />
            <ConfirmationModal show={showConfirmationModal} toggle={() => setShowConfirmationModal(false)} 
            onApprove={() => handleOnDeleteSubmit(focusedOrder?.id)} />
            </>
    )
}

export default OrdersTableSeller