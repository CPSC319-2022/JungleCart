import { useEffect, useState } from 'react';

const EditProfileModal = ({
  initialFirstName,
  initialLastName,
  initialEmail,
  onSubmit,
}) => {
  const [first_name, setFirstName] = useState(initialFirstName || '');
  const [last_name, setLastName] = useState(initialLastName || '');
  const [email, setEmail] = useState(initialEmail || '');

  useEffect(() => {
    setFirstName(initialFirstName)
    setLastName(initialLastName)
    setEmail(initialEmail)
  }, [initialFirstName, initialLastName, initialEmail])

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmitClick = () => {
    if (changed()) {
      onSubmit(first_name, last_name, email);
    }
  };

  const changed = () => {
    return (
      first_name !== initialFirstName ||
      last_name !== initialLastName ||
      email !== initialLastName
    );
  };

  return (
    <>
      <input
        type="checkbox"
        id="edit-profile"
        className="modal-toggle cursor-pointer"
      />
      <label htmlFor="edit-profile" className="modal ">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Edit Profile</h3>
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
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="text"
            value={email}
            className="input input-bordered w-full"
            onChange={handleEmailChange}
          ></input>
          <div className="modal-action">
            <label
              htmlFor="edit-profile"
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

export default EditProfileModal;
