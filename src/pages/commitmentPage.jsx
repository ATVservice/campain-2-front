import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import CommitmentForm from '../components/ManualCommitmentForm';
import { uploadCommitment, getCommitment } from '../requests/ApiRequests';
import styles from './alfonPage.module.css';

function CommitmentPage() {
  const [uploadingData, setUploadingData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [file, setFile] = useState(null);

  const hebrewToEnglishMapping = {
    'מזהה אנש': 'AnashIdentifier',
    'מספר זהות': 'PersonID',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'סכום התחייבות': 'CommitmentAmount',
    'סכום שולם': 'AmountPaid',
    'סכום שנותר': 'AmountRemaining',
    'מספר תשלומים': 'NumberOfPayments',
    'תשלומים שבוצעו': 'PaymentsMade',
    'תשלומים שנותרו': 'PaymentsRemaining',
    'מתרים': 'Fundraiser',
    'אופן תשלום': 'PaymentMethod',
    'הערות': 'Notes',
    'תשובה למתרים': 'ResponseToFundraiser',
    // 'קמפיין': 'Campaign',
  };

  // const englishToHebrewMapping = useMemo(() => ({
  //   'anashIdentifier': 'מזהה אנש',
  //   'PersonID': 'מספר זהות',
  //   'FirstName': 'שם',
  //   'LastName': 'משפחה',
  //   'CommitmentAmount': 'סכום התחייבות',
  //   'AmountPaid': 'סכום שולם',
  //   'AmountRemaining': 'סכום שנותר',
  //   'NumberOfPayments': 'מספר תשלומים',
  //   'PaymentsMade': 'תשלומים שבוצעו',
  //   'PaymentsRemaining': 'תשלומים שנותרו',
  //   'Fundraiser': 'מתרים',
  //   'PaymentMethod': 'אופן תשלום',
  //   'Notes': 'הערות',
  //   'ResponseToFundraiser': 'תשובה למתרים',
  //   // 'Campaign': 'קמפיין',

  // }), []);
  const handleAddCommitmentClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = (formData) => {
    // Send the formData to the server here
    console.log('Form data submitted:', formData);
    setIsFormOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setUploadingData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSubmit = async () => {
    const headers = uploadingData[0];
    const rows = uploadingData;
    console.log(rows);

    const mappedData = rows.slice(1, rows.length).map(row => {
      const mappedRow = {};
      headers.forEach((header, index) => {
        const englishKey = hebrewToEnglishMapping[header];
        if (englishKey) {
          mappedRow[englishKey] = row[index];
        }
      });
      return mappedRow;
    });
    try {
      const response = await uploadCommitment(mappedData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    console.log(mappedData);
  };


  return (
    <div className="commitment-page">
      <button
        onClick={handleAddCommitmentClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Commitment
      </button>

      {isFormOpen && (
        <CommitmentForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}

      <div className="mt-4">
        <input type="file" onChange={handleFileUpload} />
        <button
          onClick={handleFileSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Upload Excel File
        </button>
      </div>

      {/* Your commitments and payments table can go here */}
    </div>
  );
}

export default CommitmentPage;
