const ConfirmationModal = ({ show, toggle, onApprove }) => {
  const onSubmitClick = () => {
    toggle();
    onApprove();
  };

  return (
    <>
      <input
        type="checkbox"
        // id="add-address"
        className="modal-toggle cursor-pointer"
        checked={show}
        onChange={toggle}
      />
      <label className="modal " onClick={toggle}>
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Confirmation</h3>
          <div>Are you sure you want to continue?</div>
          <div className="modal-action">
            <label
              className="btn border-none bg-primary-dark text-white"
              onClick={toggle}
            >
              No
            </label>
            <label
              className="btn border-none bg-primary-dark text-white"
              onClick={() => onSubmitClick()}
            >
              Yes
            </label>
          </div>
        </label>
      </label>
    </>
  );
};

export default ConfirmationModal;
