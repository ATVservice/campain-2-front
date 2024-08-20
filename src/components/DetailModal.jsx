import React from 'react';
import { CgClose } from 'react-icons/cg';

const DetailModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <CgClose size={24} />
        </button>
        <h2 className="text-lg font-bold mb-2">Payment Details</h2>
        <p><strong>מספר זהות:</strong> {data.PersonID}</p>
        <p><strong>סכום:</strong> {data.CommitmentAmount}</p>
        <p><strong>אמצעי תשלום:</strong> {data.PaymentMethod}</p>
        <p><strong>קמפיין:</strong> {data.Campaign}</p>
        <p><strong>תאריך:</strong> {data.Date}</p>
      </div>
    </div>
  );
};

export default DetailModal;
