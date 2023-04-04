import { useEffect, useRef, useState } from 'react';
import { departmentIdMap } from '@/seeds/departmentIdMap';

const EditProfileModal = ({
  initialFirstName = '',
  initialLastName = '',
  initialDepartmentId = 9999,
  onSubmit,
}) => {
  const [first_name, setFirstName] = useState(initialFirstName);
  const [last_name, setLastName] = useState(initialLastName);
  const [departmentId, setDepartmentId] = useState(initialDepartmentId);

  const closeRef = useRef();

  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setDepartmentId(initialDepartmentId);
  }, [initialFirstName, initialLastName, initialDepartmentId]);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleDepartmentIdChange = (e) => {
    setDepartmentId(Number(e.target.value));
  };

  const onSubmitClick = (e) => {
    e.preventDefault();
    closeRef.current.click();
    if (changed()) {
      onSubmit(first_name, last_name, departmentId);
    }
  };

  const changed = () => {
    return (
      first_name !== initialFirstName ||
      last_name !== initialLastName ||
      departmentId !== initialDepartmentId
    );
  };

  return (
    <form onSubmit={onSubmitClick}>
      <input
        type="checkbox"
        id="edit-profile"
        className="modal-toggle cursor-pointer"
      />
      <div className="modal ">
        <div className="modal-box relative">
          <label
            ref={closeRef}
            htmlFor="edit-profile"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Edit Profile</h3>
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

          <label className="label-text">Department</label>
          <select
            className="input input-bordered w-full bg-gray-50"
            value={departmentId}
            onChange={handleDepartmentIdChange}
          >
            {Object.entries(departmentIdMap).map(([key, value]) => {
              return (
                <option key={key} value={key}>
                  {value}
                </option>
              );
            })}
          </select>
          <div className="modal-action">
            <button className="btn border-none bg-primary-dark text-white">
              submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfileModal;
