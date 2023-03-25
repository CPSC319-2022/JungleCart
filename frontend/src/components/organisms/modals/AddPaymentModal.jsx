import { useState } from 'react';

const AddPaymentModal = ({ onSubmit }) => {
  const [card_num, setCardNum] = useState('');
  const [expiration_date, setExpirationDate] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

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

  const onSubmitClick = () => {
    onSubmit(card_num, expiration_date, first_name, last_name);
  };

  return (
    <>
      <input
        type="checkbox"
        id="add-payment"
        className="modal-toggle cursor-pointer"
      />
      <label htmlFor="add-payment" className="modal ">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Add Address</h3>
          <label className="label">
            <span className="label-text">Card Number</span>
          </label>
          <input
            type="text"
            value={card_num}
            className="input input-bordered w-full"
            onChange={handleCardNumChange}
          ></input>
          <label className="label">
            <span className="label-text">Expiration Date</span>
          </label>
          <input
            type="text"
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
            className="input input-bordered w-full"
            onChange={handleFirstNameChange}
          ></input>
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            value={last_name}
            className="input input-bordered w-full"
            onChange={handleLastNameChange}
          ></input>
          <div className="modal-action">
            <label
              htmlFor="add-payment"
              className="btn border-none bg-primary-dark text-white"
              onClick={() => onSubmitClick()}
            >
              Submit
            </label>
          </div>
        </label>
      </label>
    </>
  );
};

export default AddPaymentModal;
