import { useState, useEffect, useRef } from 'react';

const EditPaymentModal = ({
  initialPayment = {
    card_num: '',
    expiration_date: '',
    first_name: '',
    last_name: '',
  },
  onSubmit,
}) => {
  const [card_num, setCardNum] = useState(initialPayment.card_num);
  const [expiration_date, setExpirationDate] = useState(
    initialPayment.expiration_date
  );
  const [first_name, setFirstName] = useState(initialPayment.first_name);
  const [last_name, setLastName] = useState(initialPayment.last_name);

  const closeRef = useRef();

  useEffect(() => {
    setCardNum(initialPayment.card_num);
    setExpirationDate(initialPayment.expiration_date);
    setFirstName(initialPayment.first_name);
    setLastName(initialPayment.last_name);
  }, [initialPayment]);

  const handleCardNumChange = (e) => {
    setCardNum(e.target.value);
  };
  const handleExpirationDateChange = (e) => {
    setExpirationDate(e.target.value);
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const onSubmitClick = (e) => {
    e.preventDefault();
    closeRef.current.click();
    if (changed()) {
      onSubmit(card_num, expiration_date, first_name, last_name);
    }
  };

  const changed = () => {
    return (
      card_num != initialPayment?.card_num ||
      expiration_date != initialPayment?.expiration_date ||
      first_name != initialPayment?.first_name ||
      last_name != initialPayment?.last_name
    );
  };

  return (
    <form onSubmit={onSubmitClick}>
      <input
        type="checkbox"
        id="edit-payment"
        className="modal-toggle cursor-pointer"
      />
      <div className="modal ">
        <div className="modal-box relative">
          <label
            ref={closeRef}
            htmlFor="edit-payment"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Edit Payment</h3>
          <label className="label">
            <span className="label-text">Card Number</span>
          </label>
          <input
            type="text"
            required
            pattern="[0-9]{16}"
            title="16 digit card number"
            value={card_num}
            className="input input-bordered w-full"
            onChange={handleCardNumChange}
          ></input>
          <label className="label">
            <span className="label-text">Expiration Date</span>
          </label>
          <input
            type="text"
            required
            pattern="[0-9]{2}\/[0-9]{2}"
            title="Expiration date of the format MM/YY"
            placeholder="MM/YY"
            value={expiration_date}
            className="input input-bordered w-full"
            onChange={handleExpirationDateChange}
          ></input>
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            value={first_name}
            required
            className="input input-bordered w-full"
            onChange={handleFirstNameChange}
          ></input>
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            required
            value={last_name}
            className="input input-bordered w-full"
            onChange={handleLastNameChange}
          ></input>
          <div className="modal-action">
            <button
              htmlFor="edit-payment"
              className="btn border-none bg-primary-dark text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditPaymentModal;
