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
        <label className="modal-box relative rounded-md min-h-[50vh] flex flex-col justify-between" htmlFor="">

          <div>
            <h3 className="text-lg font-bold py-4">Edit Order #{order?.id}</h3>
            <h6>As a seller you can manually mark items as shipped or delivered and you reserve the right to revert an item's status</h6>
            <div>

          </div>

          </div>
          <div className={"flex items-center gap-x-10 py-5 justify-between border-y border-base-200 my-2 grow"}>
            <h3 className=" font-bold">Status</h3>
            <select className="input p-2 rounded-md h-fit input-bordered w-full bg-gray-50" value={status} onChange={handleStatusChange}>
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
          </div>
          <div>
            <div className={"flex gap-x-2 py-1 items-center"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className={"text-xs"}>When an order is updated affected buyer may get emailed based on the severity of the change</p>
            </div>
            <div className={"flex gap-x-2 py-1 items-center"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" className="inline-block w-8 h-8 "><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              <p className={"text-xs "}>As a stretch goal we are working on allowing seller to modify each order item directly (currently only supported via API)</p>
            </div>
            <div className="modal-action justify-between">
              <label
                htmlFor="edit-order"
                className="btn btn-sm btn-primary border rounded-md btn-outline  "
                onClick={() => toggle()}
              >
                {"Don't Apply"}
              </label>
              <label
                htmlFor="edit-order"
                className="btn btn-sm btn-primary border rounded-md   "
                onClick={() => onSubmitClick()}
              >
                Update Order
              </label>
              {/*toggle();*/}
            </div>



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