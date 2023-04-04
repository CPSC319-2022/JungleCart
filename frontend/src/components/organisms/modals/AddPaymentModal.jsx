import { useRef, useState } from 'react';

const AddPaymentModal = ({ onSubmit }) => {
  const [card_num, setCardNum] = useState('');
  const [expiration_date, setExpirationDate] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

  const closeRef = useRef();

  // useEffect(() => {
  // }, []);

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
    onSubmit(card_num, expiration_date, first_name, last_name);
  };

  return (
    <form onSubmit={onSubmitClick}>
      <input
        type="checkbox"
        id="add-payment"
        className="modal-toggle cursor-pointer"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="add-payment"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            ref={closeRef}
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Add Payment</h3>
          <label className="label">
            <span className="label-text">Card Number</span>
          </label>
          <input
            type="text"
            value={card_num}
            pattern="[0-9]{16}"
            className="input input-bordered w-full"
            onChange={handleCardNumChange}
          ></input>
          <label className="label">
            <span className="label-text">Expiration Date</span>
          </label>
          <input
            type="text"
            value={expiration_date}
            required
            pattern="[0-9]{2}/[0-9]{2}"
            placeholder="MM/YY"
            className="input input-bordered w-full"
            onChange={handleExpirationDateChange}
          ></input>
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            required
            value={first_name}
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
            <label
              htmlFor="add-payment"
              className="btn border-none bg-primary-dark text-white"
            >
              Submit
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddPaymentModal;
