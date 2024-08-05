import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople } from '../requests/ApiRequests';
import styles from './alfonPage.module.css';

function AlfonPage() {
  const [uploadingData, setUploadingData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPeople();
        setData(response.data.data.people || []);
        console.log(response.data);
      } catch (error) { 
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
  const englishToHebrewMapping = {
    'anashIdentifier': 'קוד אנש',
    'FullNameForLists': 'שם',
    'Address': 'רחוב',
    'City': 'עיר',
    'MobilePhone': 'טל נייד',
    'HomePhone': 'טל בית',
    'CommitteeResponsibility': 'אחראי',
    'PartyGroup': 'קבוצה למסיבה',
    'DonationMethod': 'אופן התרמה',
    'GroupNumber': 'מספר קבוצה',
    'Classification': 'סיווג',
    'isActive': 'פעיל',
    'PersonID': 'קוד לקוח',
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

  const handleSubmit = async () => {
    const headers = uploadingData[1];
    const rows = uploadingData.slice(2, 30);
    const mappedData = rows.map(row => {
      const mappedRow = {};
      headers.forEach((header, index) => {
        const englishKey = hebrewToEnglishMapping[header];
        if (englishKey) {
          console.log(englishKey);
          mappedRow[englishKey] = row[index];
          if(englishKey === 'isActive' && mappedRow[englishKey] === -1){
            mappedRow[englishKey] = true;
          } else if (englishKey === 'isActive' && mappedRow[englishKey] === 0){
            mappedRow[englishKey] = false;
          }
        }
      });
      return mappedRow;
    });
    try {
      const response = await uploadPeople(mappedData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    const handleBlur = (e, rowIndex, header) => {
      return
      const newData = [...data];
      newData[rowIndex][header] = e.target.value;
      setData(newData);
    };
  
  
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <div>
        {uploadingData.length > 0 && (
          <div>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
      </div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
            {data.length > 0 && Object.keys(data[0]).map((header, index) => (
                <th key={index}>{englishToHebrewMapping[header]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {data.length > 0 && data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(data[0]).map((header, cellIndex) => (
                  <td key={cellIndex}>
                  {typeof row[header] === 'boolean' ? (
                    <input type="checkbox" checked={row[header]} readOnly />
                  ) : (
                    row[header] !== undefined ? row[header] : ''
                  )}
                </td>
              ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlfonPage;
