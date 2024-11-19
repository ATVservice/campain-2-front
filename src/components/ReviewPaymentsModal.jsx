import React, { useState } from 'react';

function ReviewPaymentsModal({ onUploadPayments, validPayments, invalidPayments, onClose }) {
    const hebrewToEnglishMapping = {
        "מזהה אנש": "AnashIdentifier",
        "מספר זהות": "PersonID",
        'שם': "FirstName",
        'משפחה': "LastName",
        "סכום התחייבות": "CommitmentAmount",
        "סכום שולם": "AmountPaid",
        "סכום שנותר": "AmountRemaining",
        "מספר תשלומים": "NumberOfPayments",
        "תשלומים שבוצעו": "PaymentsMade",
        "תשלומים שנותרו": "PaymentsRemaining",
        'מתרים': "Fundraiser",
        "אופן תשלום": "PaymentMethod",
        'הערות': "Notes",
        "תשובה למתרים": "ResponseToFundraiser",
        "יום הנצחה": "MemorialDay",
        'הנצחה': "Commemoration",
        "מספר התחייבות": "CommitmentId",
        'סכום': "Amount",
        'תאריך': "Date",
        'קמפיין': "CampainName",
      };
      const [showValidPayments, setShowValidPayments] = useState(()=> validPayments.length > 0);
      const [paymentsToDisplay, setPaymentsToDisplay] = useState(showValidPayments ? validPayments : invalidPayments);
      function handleChange() {
        setPaymentsToDisplay(showValidPayments ? invalidPayments : validPayments);
        setShowValidPayments(!showValidPayments);
      }
      function handelUpload() {
        onUploadPayments();
      }
    
    
      return (
        <div>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center rtl z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-auto max-w-full h-[80vh] flex flex-col relative ">
              {/* Header section */}
              <div className="mb-4">
                <div className="flex justify-between items-center gap-6">
                  <h2 className="text-2xl font-semibold">תשלומים תקינים : <span className="text-emerald-500">{validPayments.length}</span></h2>
                  <h2 className="text-2xl font-semibold">תשלומים לא תקינים: <span className="text-red-500">{invalidPayments.length}</span></h2>
                  <h2 className="text-2xl font-semibold">סה"כ תשלומים: <span className="text-gray-500">{validPayments.length + invalidPayments.length}</span></h2>
                  {showValidPayments ? (
                    <button
                      onClick={() => handleChange()}
                      className="font-bold text-lg bg-red-500 text-white rounded hover:bg-red-700 px-4 py-2"
                    >
                      הצג לא תקינים
                    </button>
                  ) : (
                    <button
                      onClick={() => handleChange()}
                      className="font-bold text-lg bg-green-500 text-white rounded hover:bg-green-700 px-4 py-2"
                    >
                      הצג תקינים
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    <span className="text-2xl">x</span>
                  </button>
                </div>
              </div>
      
              {/* Table container with its own scrollable area */}
              <div className="flex-1 overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto h-full">
                  <table className="min-w-full table-auto rtl">
                    <thead className={`sticky top-0 ${showValidPayments ? 'bg-emerald-300' : 'bg-red-500'}`}>
                      <tr>
                        {!showValidPayments && (
                          <th className="py-2 px-4 text-center whitespace-nowrap">סיבה</th>
                        )}
                        <th className="py-2 px-2 text-center whitespace-nowrap">מזהה אנ"ש</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">שם קמפיין</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">שם</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">משפחה</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">סכום</th>
                        <th className="py-2 px-2 text-center whitespace-nowrap">אופן תשלום</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsToDisplay.map((payment, index) => (
                        <tr key={index} className="border-t">
                          {!showValidPayments && (
                            <td className="py-2 px-4 text-center">{payment.reason || "-"}</td>
                          )}
                          <td className="py-2 px-2 text-center">{payment.AnashIdentifier || "-"}</td>
                          <td className="py-2 px-2 text-center">{payment.CampainName || "-"}</td>
                          <td className="py-2 px-2 text-center">{payment.FirstName || "-"}</td>
                          <td className="py-2 px-2 text-center">{payment.LastName || "-"}</td>
                          <td className="py-2 px-2 text-center">{payment.Amount ?? "-"}</td>
                          <td className="py-2 px-2 text-center">{payment.PaymentMethod || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
      
              {/* Fixed bottom left button */}
              <div className="absolute bottom-6 left-6">
                <button
                  onClick={handelUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  הוסף תשלומים תקינים
                </button>
              </div>
            </div>
          </div>
        </div>
      );}

export default ReviewPaymentsModal