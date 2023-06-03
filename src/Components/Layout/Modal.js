import ReactDOM from "react-dom";

const ModalComponent = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 
    overflow-hidden md:inset-0 h-full max-h-full bg-slate-800/[0.9] flex items-center">
      <div className="relative w-full max-w-2xl mx-auto z-[1000] bg-transparent">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {props.label}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal"
              onClick={closeModal}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="space-y-6">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

const Modal = (props) => {
  return ReactDOM.createPortal(
    <ModalComponent
      children={props.children}
      label={props.label}
      setShowModal={props.setShowModal}
    />,
    document.getElementById("modal")
  );
};

export default Modal;
