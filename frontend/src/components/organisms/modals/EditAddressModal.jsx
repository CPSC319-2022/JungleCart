import { useState, useEffect, useRef } from 'react';

const EditAddressModal = ({
  initialAddress = {
    recipient: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    telephone: '',
  },
  show,
  toggle,
  onSubmit,
}) => {
  const [recipient, setRecipient] = useState(initialAddress.recipient);
  const [address_line1, setAddressLine1] = useState(
    initialAddress.address_line_1
  );
  const [address_line2, setAddressLine2] = useState(
    initialAddress.address_line_2
  );
  const [city, setCity] = useState(initialAddress.city);
  const [province, setProvince] = useState(initialAddress.province);
  const [postal_code, setPostalCode] = useState(initialAddress.postal_code);
  const [telephone, setTelephone] = useState(initialAddress.telephone);

  const closeRef = useRef(null);

  useEffect(() => {
    setRecipient(initialAddress.recipient);
    setAddressLine1(initialAddress.address_line_1);
    setAddressLine2(initialAddress.address_line_2);
    setCity(initialAddress.city);
    setProvince(initialAddress.province);
    setPostalCode(initialAddress.postal_code);
    setTelephone(initialAddress.telephone);
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

  const handleTelephoneChange = (e) => {
    setTelephone(e.target.value);
  };

  const onSubmitClick = (e) => {
    e.preventDefault();
    closeRef.current.click();
    if (changed()) {
      toggle();
      onSubmit(
        initialAddress.id,
        initialAddress.preferred,
        recipient,
        address_line1,
        address_line2,
        city,
        province,
        postal_code,
        telephone
      );
    }
  };

  const changed = () => {
    return (
      recipient != initialAddress?.recipient ||
      address_line1 != initialAddress?.address_line_1 ||
      address_line2 != initialAddress?.address_line_2 ||
      city != initialAddress?.city ||
      province != initialAddress?.province ||
      postal_code != initialAddress?.postal_code ||
      telephone != initialAddress?.telephone
    );
  };

  return (
    <form onSubmit={onSubmitClick}>
      <input
        type="checkbox"
        id="edit-address"
        className="modal-toggle cursor-pointer"
        checked={show}
        onChange={toggle}
      />
      <div className="modal " onClick={toggle}>
        <div
          className="modal-box relative"
          onClick={(e) => e.stopPropagation()}
        >
          <label
            ref={closeRef}
            htmlFor="edit-address"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Edit Address</h3>
          <label className="label">
            <span className="label-text">Recipient</span>
          </label>
          <input
            type="text"
            required
            value={recipient}
            className="input input-bordered w-full"
            onChange={handleRecipientChange}
          ></input>
          <label className="label">
            <span className="label-text">Address Line 1</span>
          </label>
          <input
            type="text"
            required
            pattern="[a-zA-Z0-9\s\,\.\-]{3,}"
            title='alpha numeric characters including spaces, comas, and dashes with a minimum of 3 characters'
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
              required
              value={city}
              className="input input-bordered w-full"
              onChange={handleCityChange}
            ></input>
            <label className="label">
              <span className="label-text">Province</span>
            </label>
            <input
              type="text"
              required
              value={province}
              className="input input-bordered w-full"
              onChange={handleProvinceChange}
            ></input>
            <label className="label">
              <span className="label-text">Postal Code</span>
            </label>
            <input
              type="text"
              required
              pattern="[a-zA-Z][0-9][a-zA-Z]\s?[0-9][a-zA-Z][0-9]"
              title="Regular forms of postal codes in Canada, of the form A1A1A1 or A1A 1A1"
              value={postal_code}
              className="input input-bordered w-full"
              onChange={handlePostalCodeChange}
            ></input>
            <label className="label">
              <span className="label-text">Telephone</span>
            </label>
            <input
              type="text"
              required
              pattern="(\+?1)?\d{10}"
              title="North American phone number format, optional + and or 1 at the start, followed by 10 digits"
              value={telephone}
              className="input input-bordered w-full"
              onChange={handleTelephoneChange}
            ></input>
          </div>
          <div className="modal-action">
            <button
              // htmlFor="edit-address"
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

export default EditAddressModal;
