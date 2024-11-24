import React from "react";
import ReactModal from "react-modal";

function PasswordConfirmationModal({ isOpen, onClose, onSubmit, password, setPassword }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Modal"
      className="modal p-6 bg-white rounded-lg shadow-lg"
      overlayClassName="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-semibold text-center mb-4">אנא הזן את סיסמתך</h2>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="סיסמה"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              אישור
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded ml-2"
            >
              ביטול
            </button>
        </div>
      </form>
    </ReactModal>
  );
}

export default PasswordConfirmationModal;
