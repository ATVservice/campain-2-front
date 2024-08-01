import React, { useState } from 'react';
import * as XLSX from 'xlsx';
// import axios from 'axios';

function App() {


  const [data, setData] = useState([]);

  const hebrewToEnglishMapping = {
    'קוד אנש': 'CustomerID',
    'שם': 'FullNameForLists',
    'רחוב': 'Address',
    'עיר': 'City',
    'טל נייד': 'MobilePhone',
    'טל בית': 'HomePhone',
    'אחראי': 'CommitteeResponsibility',
    'קבוצה למסיבה': 'PartyGroup',
    'אופן התרמה': 'DonationMethod',
    'מספר קבוצה': 'GroupNumber',
    'סיווג': 'Classification',
    'פעיל': 'ActiveInactive'
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
      setData(json);
      };
    reader.readAsArrayBuffer(file);
  };
  const handleSubmit = async () => {
    const headers = data[1];
    const rows = data.slice(2,10);
    const mappedData = rows.map(row => {
      const mappedRow = {};
      headers.forEach((header, index) => {
        const englishKey = hebrewToEnglishMapping[header];
        if (englishKey) {
          mappedRow[englishKey] = row[index];
        }
      });
      return mappedRow;
    });
    console.log(mappedData);

    // await axios.post('/api/upload', mappedData);
  };


  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {data.length > 0 && (
        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default App
