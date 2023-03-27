import { useState, useEffect } from 'react';

const EditAddressModal = ({ initialAddress, show, toggle, onSubmit }) => {
  const [recipient, setRecipient] = useState(initialAddress?.recipient || '');
  const [address_line1, setAddressLine1] = useState(
    initialAddress?.address_line1 || ''
  );
  const [address_line2, setAddressLine2] = useState(
    initialAddress?.address_line2 || ''
  );
  const [city, setCity] = useState(initialAddress?.city || '');
  const [province, setProvince] = useState(initialAddress?.province || '');
  const [postal_code, setPostalCode] = useState(
    initialAddress?.postal_code || ''
  );

  useEffect(() => {
    setRecipient(initialAddress?.recipient);
    setAddressLine1(initialAddress?.recipient);
    setAddressLine2(initialAddress?.address_line2);
    setCity(initialAddress?.city);
    setProvince(initialAddress?.province);
    setPostalCode(initialAddress?.postal_code);
  }, [initialAddress]);

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };
  const handleAddressLine1Change = (e) => {
    setAddressLine1(e.target.value);
  };
  const handleAddressLine2Change = (e) => {
    setAddressLine2(e.target.value);
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  const handleProvinceChange = (e) => {
    setProvince(e.target.value);
  };
  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };

  const onSubmitClick = () => {
    if (changed()) {
      toggle();
      onSubmit(
        recipient,
        address_line1,
        address_line2,
        city,
        province,
        postal_code
      );
    }
  };

  const changed = () => {
    return (
      recipient != initialAddress?.recipient ||
      address_line1 != initialAddress?.address_line1 ||
      address_line2 != initialAddress?.address_line2 ||
      city != initialAddress?.city ||
      province != initialAddress?.province ||
      postal_code != initialAddress?.postal_code
    );
  };

  return (
    <>
      <input
        type="checkbox"
        // id="edit-address"
        className="modal-toggle cursor-pointer"
        checked={show}
        onChange={toggle}
      />
      <label
        // htmlFor="edit-address"
        className="modal "
        onClick={toggle}
      >
        <label
          className="modal-box relative"
          htmlFor=""
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold">Edit Address</h3>
          <label className="label">
            <span className="label-text">Recipient</span>
          </label>
          <input
            type="text"
            value={recipient}
            className="input input-bordered w-full"
            onChange={handleRecipientChange}
          ></input>
          <label className="label">
            <span className="label-text">Address Line 1</span>
          </label>
          <input
            type="text"
            value={address_line1}
            className="input input-bordered w-full"
            onChange={handleAddressLine1Change}
          ></input>
          <label className="label">
            <span className="label-text">Address Line 2</span>
          </label>
          <input
            type="text"
            value={address_line2}
            className="input input-bordered w-full"
            onChange={handleAddressLine2Change}
          ></input>
          <div>
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              value={city}
              className="input input-bordered w-full"
              onChange={handleCityChange}
            ></input>
            <label className="label">
              <span className="label-text">Province</span>
            </label>
            <input
              type="text"
              value={province}
              className="input input-bordered w-full"
              onChange={handleProvinceChange}
            ></input>
            <label className="label">
              <span className="label-text">Postal Code</span>
            </label>
            <input
              type="text"
              value={postal_code}
              className="input input-bordered w-full"
              onChange={handlePostalCodeChange}
            ></input>
          </div>
          <div className="modal-action">
            <label
              // htmlFor="edit-address"
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

export default EditAddressModal;

{
  /* <>
      <input
        type="checkbox"
        // id="edit-address"
        className="modal-toggle cursor-pointer"
        checked={show}
        onChange={toggle}
      />
      <label
        // htmlFor="edit-address"
        className="modal "
        onClick={toggle}
      >
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Edit Address</h3>
          <label className="label">
            <span className="label-text">Recipient</span>
          </label>
          <input
            type="text"
            value={recipient}
            className="input input-bordered w-full"
            onChange={handleRecipientChange}
          ></input>
          <div className="modal-action">
            <label
              // htmlFor="edit-address"
              className="btn border-none bg-primary-dark text-white"
              onClick={() => onSubmitClick()}
            >
              Submit
            </label>
          </div>
        </label>
      </label>
    </> */
}
