import { useState } from 'react';

const AddAddressModal = ({ onSubmit }) => {
  const [recipient, setRecipient] = useState('');
  const [address_line1, setAddressLine1] = useState('');
  const [address_line2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postal_code, setPostalCode] = useState('');
  const [telephone, setTelephone] = useState('');

  // useEffect(() => {
  // }, []);

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
  }

  const onSubmitClick = () => {
    onSubmit(
      recipient,
      address_line1,
      address_line2,
      city,
      province,
      postal_code,
      telephone
    ).then(() => {
      setRecipient('')
      setAddressLine1('')
      setAddressLine2('')
      setCity('')
      setPostalCode('')
      setProvince('')
      setTelephone('')
    });
  };

  return (
    <>
      <input
        type="checkbox"
        id="add-address"
        className="modal-toggle cursor-pointer"
      />
      <label htmlFor="add-address" className="modal ">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Add Address</h3>
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
            <label className="label">
              <span className="label-text">Telephone</span>
            </label>
            <input
              type="text"
              value={telephone}
              className="input input-bordered w-full"
              onChange={handleTelephoneChange}
            ></input>
          </div>
          <div className="modal-action">
            <label
              htmlFor="add-address"
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

export default AddAddressModal;
