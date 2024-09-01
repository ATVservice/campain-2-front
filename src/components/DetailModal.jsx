import React from 'react';

function DetailModal({ data = { success: [], failed: [] }, onClose }) {
  const successData = data.success || [];
  const failedData = data.failed || [];

  // Determine if the data is related to payments or commitments based on success and failed data
  const isPayments = (successData.length > 0 && successData[0].paymentAmount !== undefined) ||
                     (failedData.length > 0 && failedData[0].paymentAmount !== undefined);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-h-[80%] overflow-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          סגור
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {isPayments ? 'סיכום העלאת תשלומים' : 'סיכום העלאת התחייבויות'}
        </h2>
        <div>
          <h3 className="text-xl font-semibold">
            {isPayments ? `תשלומים שהועלו בהצלחה (${successData.length}):` : `התחייבויות שהועלו בהצלחה (${successData.length}):`}
          </h3>
          <ul>
            {successData.length > 0 ? (
              <li>{`הועלו בהצלחה ${successData.length} ${isPayments ? 'תשלומים' : 'התחייבויות'}`}</li>
            ) : (
              <li>{`לא הועלו ${isPayments ? 'תשלומים' : 'התחייבויות'} בהצלחה`}</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold">
            {isPayments ? `תשלומים שנכשלו (${failedData.length}):` : `התחייבויות שנכשלו (${failedData.length}):`}
          </h3>
          <ul>
            {failedData.length > 0 ? (
              failedData.map((item, index) => (
                <li key={index}>
                  {`מזהה אנ"ש: ${item.AnashIdentifier || 'N/A'}, מספר זהות: ${item.PersonID || 'N/A'}, שם: ${item.FirstName} ${item.LastName || 'N/A'}, סיבה: ${item.reason}`}
                </li>
              ))
            ) : (
              <li>{`לא נכשלו ${isPayments ? 'תשלומים' : 'התחייבויות'}`}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
