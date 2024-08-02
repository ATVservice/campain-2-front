import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople } from '../requests/ApiRequests';



function AlfonPage() {
    const [data, setData] = useState([]);

    const hebrewToEnglishMapping = {
      'קוד אנש': 'anashIdentifier',
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
      'פעיל': 'isActive'
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
        // console.log(json)
        setData(json);
    }
    reader.readAsArrayBuffer(file);
    
};
    const handleSubmit = async () => {
        const headers = data[1];
        const rows = data.slice(2,10);
        console.log(rows);
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
        // console.log(mappedData);
        try {
          const response = await uploadPeople(mappedData);
          console.log(response);
        } catch (error) {
          console.error(error);
        }
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
  )
}

export default AlfonPage