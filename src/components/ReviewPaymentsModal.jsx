import React, { useState, useEffect } from 'react';

import SearchFilter from './SearchFilter';
import {exportToExcel, exportToPDF} from "../../Reports/exportFilesHandler.jsx";
import { format } from 'date-fns';
import { RiFileExcel2Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import{englishToHebrewPaymentsMapping,hebrewToEnglishPaymentsMapping} from '../components/Utils'


function ReviewPaymentsModal({ onUploadPayments, validPaymentsWithCommitment, validPaymentsWithoutCommitment, invalidPayments, onClose }) {
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
  const [activeDisplayOption, setActiveDisplayOption] = useState(() => {
    if (validPaymentsWithCommitment.length > 0) {
      return 'validPaymentsWithCommitment';
    } else if (validPaymentsWithoutCommitment.length > 0) {
      return 'validPaymentsWithoutCommitment';
    } else {
      return 'invalidPayments';
    }
  });
  const paymentsToDisplay =
    activeDisplayOption === 'validPaymentsWithCommitment'
      ? validPaymentsWithCommitment
      : activeDisplayOption === 'validPaymentsWithoutCommitment'
        ? validPaymentsWithoutCommitment
        : invalidPayments;
  const [filteredPayments, setFilteredPayments] = useState([]);
  useEffect(() => {
    setFilteredPayments(paymentsToDisplay || []);
  }, [paymentsToDisplay]); // Run this effect whenever paymentsToDisplay changes


  // Function to handle switching between options
  const handleDisplayChange = (option) => {
    setActiveDisplayOption(option);
  };

  const getFilteredData = (filteredData) => {
    setFilteredPayments(filteredData);
  };

  function handelUpload() {
    onUploadPayments();
  }

  const buttonStyles = (option) => {
    // Apply background color based on activeDisplayOption
    return option === activeDisplayOption
      ? 'bg-green-700' // Darker background for active
      : 'bg-green-500'; // Normal background
  };
      const handleExportToExcel = () => {
        const columns = Array.from(new Set(filteredPayments.flatMap(item => Object.keys(item)))).filter((item, index) => item !=='CommitmentId');
        // console.log(columns);
        exportToExcel(filteredPayments,columns,englishToHebrewPaymentsMapping, "data");
      };
  



  return (
    <div>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center rtl z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-auto max-w-full h-[90vh] flex flex-col relative ">
          {/* Header section */}
          <div className="mb-4">
            <div className="flex justify-evenly gap-6 ">
              <div>
                <h2 className="text-xl font-semibold">תשלומים תקינים עם התחייבות: <span className="text-emerald-500">{validPaymentsWithCommitment.length}</span></h2>
                <h2 className="text-xl font-semibold">תשלומים תקינים ללא התחייבות: <span className="text-emerald-500">{validPaymentsWithoutCommitment.length}</span></h2>
              </div>
              <div>
                <h2 className="text-xl font-semibold">תשלומים לא תקינים: <span className="text-red-500">{invalidPayments.length}</span></h2>
                <h2 className="text-xl font-semibold">סה"כ תשלומים: <span className="text-gray-500">{validPaymentsWithCommitment.length + validPaymentsWithoutCommitment.length + invalidPayments.length}</span></h2>
              </div>
              <button
                onClick={() => handleDisplayChange('validPaymentsWithCommitment')}
                className={`font-bold text-sm text-white rounded hover:bg-green-700 px-2 py-2 w-[100px] ${buttonStyles('validPaymentsWithCommitment')}`}
              >
                הצג תקינים עם התחייבות
              </button>
              <button
                onClick={() => handleDisplayChange('validPaymentsWithoutCommitment')}
                className={`font-bold text-sm text-white rounded hover:bg-green-700 px-2 py-2 w-[100px] ${buttonStyles('validPaymentsWithoutCommitment')}`}
              >
                הצג תקינים ללא התחייבות
              </button>
              <button
                onClick={() => handleDisplayChange('invalidPayments')}
                className={`font-bold text-sm text-white rounded hover:bg-red-700 px-2 py-2 w-[100px] ${activeDisplayOption === 'invalidPayments' ? 'bg-red-700' : 'bg-red-500'}`}
              >
                הצג לא תקינים
              </button>
              <button
                className='flex flex-col gap-1 text-center items-center justify-center'
                onClick={handleExportToExcel}
              >
                <RiFileExcel2Line size={24} className='text-blue-800' />
                <FaDownload size={16} className='text-blue-800 ' />
              </button>




              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 font-bold text-lg flex gap-2"
              >
                <span className="text-2xl">x</span>
              </button>
            </div>
          </div>
          <SearchFilter
            data={paymentsToDisplay}
            columns={['FirstName', 'LastName', 'AnashIdentifier']}
            onFilter={getFilteredData}
            placeholder={'חיפוש לפי שם/משפחה/אנש'}

          />


          {/* Table container with its own scrollable area */}
          <div className="flex-1 overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto h-full">
              <table className="min-w-full table-auto rtl">
                <thead className={`sticky top-0 ${(activeDisplayOption === 'validPaymentsWithCommitment' || activeDisplayOption === 'validPaymentsWithoutCommitment') ? 'bg-emerald-300' : 'bg-red-500'}`}>
                  <tr>
                    {activeDisplayOption === 'invalidPayments' && (
                      <th className="py-2 px-4 text-center whitespace-nowrap">סיבה</th>
                    )}
                    <th className="py-2 px-2 text-center whitespace-nowrap">מזהה אנ"ש</th>
                    <th className="py-2 px-2 text-center whitespace-nowrap">שם קמפיין</th>
                    <th className="py-2 px-2 text-center whitespace-nowrap">שם</th>
                    <th className="py-2 px-2 text-center whitespace-nowrap">משפחה</th>
                    <th className="py-2 px-2 text-center whitespace-nowrap">סכום</th>
                    <th className="py-2 px-2 text-center whitespace-nowrap">אופן תשלום</th>
                    <th className="py-2 px-2 text-center whitespace-nowrap"> תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments?.map((payment, index) => (
                    <tr key={index} className="border-t">
                      {activeDisplayOption === 'invalidPayments' && (
                        <td className="py-2 px-4 text-center">{payment.reason || ""}</td>
                      )}
                      <td className="py-2 px-2 text-center">{payment.AnashIdentifier || ""}</td>
                      <td className="py-2 px-2 text-center">{payment.CampainName || ""}</td>
                      <td className="py-2 px-2 text-center">{payment.FirstName || ""}</td>
                      <td className="py-2 px-2 text-center">{payment.LastName || ""}</td>
                      <td className="py-2 px-2 text-center">{payment.Amount ?? ""}</td>
                      <td className="py-2 px-2 text-center">{payment.PaymentMethod || ""}</td>
                      <td className="py-2 px-2 text-center">{format(new Date(payment.Date), 'dd/MM/yyyy') || ""}</td>
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
  );
}

export default ReviewPaymentsModal