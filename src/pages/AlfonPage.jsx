








import { CgDetailsMore } from "react-icons/cg";
import { useNavigate,useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople,upadateUserDetails ,deleteUser} from '../requests/ApiRequests';
import styles from './alfonPage.module.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Table from "../components/Table";

function AlfonPage() {

  const [uploadingData, setUploadingData] = useState([]);
  const [rowData, setRowData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPeople();
        setRowData(response.data.data.people || []);
  
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


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
    const headers = uploadingData[0];
    const rows = uploadingData;
    const mappedData = rows.slice(1, 30).map(row => {
      const mappedRow = {};
      headers.forEach((header, index) => {
        const englishKey = hebrewToEnglishMapping[header];
        if (englishKey) {
          mappedRow[englishKey] = row[index];
          if (englishKey === 'isActive') {
            mappedRow[englishKey] = row[index] === -1;
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
      <Table rowData={rowData} setRowData={setRowData} />
    </div>
  );
}

export default AlfonPage;







  //     'מזהה אנש': 'anashIdentifier',
//     'שם מלא': 'FullNameForLists',
//     'שם': 'FirstName',
//     'משפחה': 'LastName',
//     'שם האב': 'FatherName',
//     'מספר זהות': 'IdentityNumber',
//     'כתובת': 'Address',
//     'מספר': 'adressNumber',
//     'קומה': 'floor',
//     'מיקוד': 'zipCode',
//     'עיר': 'City',
//     'נייד 1 ': 'MobilePhone',
//     'נייד בבית 1': 'MobileHomePhone',
//     'בית 1': 'HomePhone',
//     'דוא"ל': 'Email',
//     'בית מדרש': 'BeitMidrash',
//     'סיווג': 'Classification',
//     'אופן התרמה': 'DonationMethod',
//     'מתרים': 'fundRaiser',
//     'למד בישיבה בשנים': 'StudiedInYeshivaYears',
//     'שנה ישיג': 'yashagYear',
//     'אחראי ועד': 'CommitteeResponsibility',
//     'קבוצה למסיבה': 'PartyGroup',
//     'מספר קבוצה': 'GroupNumber',
//     'שם מזמין למסיבה': 'PartyInviterName',
//     'פעיל לא פעיל': 'isActive',
//     'שדה חופשי': 'FreeFieldsToFillAlone',
//     'שדה חופשי 2': 'AnotherFreeFieldToFillAlone',
//     'הערות אלפון': 'PhoneNotes',
//   };
