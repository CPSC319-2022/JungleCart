import { useEffect, useState } from 'react';
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

  const onSubmitClick = () => {
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
          
          <label className="label-text">Department</label>
          <select className="input input-bordered w-full bg-gray-50" value={departmentId} onChange={handleDepartmentIdChange}>
            {Object.entries(departmentIdMap).map(([key, value]) => {
              
              return(
                <option key={key} value={key}>{value}</option>
              )
            })}
          </select>
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
