import React, { useState, useMemo } from 'react';
import SearchFilter from './SearchFilter';
import {exportToExcel, exportToPDF} from "../../Reports/exportFilesHandler.jsx";
import { format } from 'date-fns';
import { RiFileExcel2Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import {englishToHebrewCommitmentMapping,hebrewToEnglishCommitmentMapping} from '../components/Utils'


function ReviewCommitmentsModal({ onUploadCommitment, validCommitments, invalidCommitments, onClose }) {
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
  const [showValidCommitments, setShowValidCommitments] = useState(()=> validCommitments.length > 0);
  const [commitmentsToDisplay, setCommitmentsToDisplay] = useState(showValidCommitments ? validCommitments : invalidCommitments);
  const [filteredCommitments, setFilteredCommitments] = useState(commitmentsToDisplay||[]);
  // console.log(filteredCommitments);
  // console.log(commitmentsToDisplay);


  const handleChange = () => {
    const newCommitments = showValidCommitments ? invalidCommitments : validCommitments;
    setCommitmentsToDisplay(newCommitments);
    setFilteredCommitments(newCommitments);
    setShowValidCommitments(!showValidCommitments);
  };
  const getFilteredData = (filteredData) => {
    setFilteredCommitments(filteredData);
  };

  function handelUpload() {
    onUploadCommitment();
  }
    const handleExportToExcel = () => {
      const columns = Array.from(new Set(filteredCommitments.flatMap(item => Object.keys(item))));
      exportToExcel(filteredCommitments,columns,englishToHebrewCommitmentMapping, "data");
    };
  
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center rtl z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-auto max-w-full h-[80vh] flex flex-col z-50">

        {/* Header section */}
        <div className=" mb-4 mx-4">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <h2 className="text-xl font-semibold">התחייבויות תקינות: <span className="text-emerald-500">{validCommitments.length}</span></h2>
              <h2 className="text-xl font-semibold">התחייבויות לא תקינות: <span className="text-red-500">{invalidCommitments.length}</span ></h2>
              <h2 className="text-xl font-semibold">סה"כ התחייבויות: <span className="text-gray-500">{validCommitments.length + invalidCommitments.length}</span></h2>
              </div>
              <div className="flex gap-10">
              {showValidCommitments ? (
                <button
                  onClick={() => handleChange()}
                  className="font-bold text-lg bg-red-500 text-white rounded hover:bg-red-700 px-4 py-2"
                >
                  הצג לא תקינות
                </button>
              ) : (
                <button
                  onClick={() => handleChange()}
                  className="font-bold text-lg bg-green-500 text-white rounded hover:bg-green-700 px-4 py-2"
                >
                  הצג תקינות
                </button>
              
              
              )}
              <button
                  className='flex flex-col gap-1 text-center items-center justify-center'
                  onClick={handleExportToExcel}
                >
                  <RiFileExcel2Line size={24} className='text-blue-800' />
                  <FaDownload size={16} className='text-blue-800 ' />
                </button>
              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                <span className="text-2xl">x</span>
              </button>
            </div>
          </div>
        </div>
        <SearchFilter
          data={commitmentsToDisplay}
          columns = {['FirstName', 'LastName', 'AnashIdentifier']}
          onFilter={getFilteredData}
          placeholder={'חיפוש לפי שם/משפחה/אנש'}
        />


        {/* Table container with its own scrollable area */}
        <div className="overflow-hidden z-51">
          <div className="overflow-x-auto overflow-y-auto h-full">
            <table className="min-w-full table-auto rtl z-51">
              <thead className={`sticky top-0 ${showValidCommitments ? 'bg-emerald-300' : 'bg-red-500'}`}>
              <tr>
                {!showValidCommitments && (
                  <th className="py-2 px-4 text-center whitespace-nowrap">סיבה</th>
                )}
                <th className="py-2 px-2 text-center whitespace-nowrap">מזהה אנ"ש</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">שם קמפיין</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">שם</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">משפחה</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">סכום התחייבות</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">סכום שולם</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">סכום שנותר</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">מספר תשלומים</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">תשלומים שבוצעו</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">תשלומים שנותרו</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">מתרים</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">אופן תשלום</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">הערות</th>
                <th className="py-2 px-2 text-center whitespace-nowrap">תשובה למתרים</th>
              </tr>
              </thead>
              <tbody className='z-50'>
                {
                  filteredCommitments?.map((commitment, index) => (
                    <tr key={index} className="border-t">
                      {!showValidCommitments && (
                        <td className="py-2 px-4 text-center">{commitment.reason || "-"}</td>
                      )}
                      <td className="py-2 px-2 text-center">{commitment.AnashIdentifier || "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.CampainName || "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.FirstName || "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.LastName || "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.CommitmentAmount ?? "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.AmountPaid ?? "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.AmountRemaining ?? "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.NumberOfPayments ?? "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.PaymentsMade ?? "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.PaymentsRemaining ?? "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.Fundraiser || "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.PaymentMethod || "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.Notes || "-"}</td>
                      <td className="py-2 px-2 text-center">{commitment.ResponseToFundraiser || "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handelUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            הוסף התחייבויות תקינות
          </button>
        </div>
      </div>
    </div>
  );


}

export default ReviewCommitmentsModal;
