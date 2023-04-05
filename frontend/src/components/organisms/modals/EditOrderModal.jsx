import { useState, useEffect } from "react";
import { orderStatusMap } from "@/seeds/orderStatusMap";
import { orderItemStatusMap } from "@/seeds/orderItemStatusMap";

const EditOrderModal = ({
    initialOrder,
    onSubmit,
    toggle,
    isSeller = false}) => {
    const [order, setOrder] = useState(initialOrder)
    const [status, setStatus] = useState(isSeller ? initialOrder?.status ?? '' :initialOrder?.status_label ?? '')

    useEffect(() => {
        setOrder(initialOrder)
        setStatus(isSeller ? initialOrder?.status ?? '' :initialOrder?.status_label ?? '')
    }, [initialOrder, isSeller])

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
    }

    const onSubmitClick = () => {
        toggle();
        onSubmit(status, isSeller ? initialOrder.order_id : initialOrder.id, initialOrder.product_id)
    }

    return (
    <>
        <input type="checkbox" id="edit-order" className="modal-toggle" />
        <label htmlFor="edit-order" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
            <h3 className="text-lg font-bold">Edit Order {order?.id}</h3>
            
          <label className="label-text">Status</label>
            <select className="input input-bordered w-full bg-gray-50" value={status} onChange={handleStatusChange}>
            {isSeller ? 
            Object.entries(orderItemStatusMap).map(([key, value]) => {
              return(
                <option key={key} value={value}>{value}</option>
              )
            })
            : 
            Object.entries(orderStatusMap).map(([key, value]) => {
              return(
                <option key={key} value={value}>{value}</option>
              )
            })}
          </select>
          <div className="modal-action">
            <label
              htmlFor="edit-order"
              className="btn border-none bg-primary-dark text-white"
              onClick={() => onSubmitClick()}
            >
              Submit
            </label>
          </div>
        </label>
        </label>
    </>
    )

    // return(
    //     <>
    //     <input
    //       type="checkbox"
    //     //   id="edit-order"
    //       className="modal-toggle cursor-pointer"
    //       onChange={toggle}
    //     />
    //     <label  className="modal " onClick={toggle}>
    //       <label className="modal-box relative" htmlFor="">
    //         <h3 className="text-lg font-bold">Edit Order {initialOrder.id}</h3>
            
    //         <label className="label-text">Order Status</label>
    //         <select className="input input-bordered w-full bg-gray-50" value={status} onChange={handleStatusChange}>
    //           {Object.entries(orderStatusMap).map(([key, value]) => {
                
    //             return(
    //               <option key={key} value={value}>{value}</option>
    //             )
    //           })}
    //         </select>
    //         <div className="modal-action">
    //           <label
    //             className="btn border-none bg-primary-dark text-white"
    //             onClick={() => onSubmitClick()}
    //           >
    //             Submit
    //           </label>
    //         </div>
    //       </label>
    //     </label>
    //   </>
    // )
}

export default EditOrderModal