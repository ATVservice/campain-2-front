








import { CgDetailsMore } from "react-icons/cg";
import { useNavigate,useParams } from "react-router-dom";
import React, { useState, useEffect,useRef } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople,upadateUserDetails ,deleteUser,getAlfonChanges} from '../requests/ApiRequests';
import styles from './alfonPage.module.css';
import AlfonChanges from "../components/AlfonChanges";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Table from "../components/Table";
import Spinner from "../components/Spinner";
function AlfonPage() {
  const hebrewToEnglishMapping = {
     'מזהה אנש': 'anashIdentifier',
    'שם מלא': 'FullNameForLists',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'שם האב': 'FatherName',
    'מספר זהות': 'IdentityNumber',
    'כתובת': 'Address',
    'מספר': 'addressNumber',
    'קומה': 'floor',
    'מיקוד': 'zipCode',
    'עיר': 'City',
    'נייד 1 ': 'MobilePhone',
    'נייד בבית 1': 'MobileHomePhone',
    'בית 1': 'HomePhone',
    'דוא"ל': 'Email',
    'בית מדרש': 'BeitMidrash',
    'סיווג': 'Classification',
    'אופן התרמה': 'DonationMethod',
    'מתרים': 'fundRaiser',
    'למד בישיבה בשנים': 'StudiedInYeshivaYears',
    'שנה ישיג': 'yashagYear',
    'אחראי ועד': 'CommitteeResponsibility',
    'קבוצה למסיבה': 'PartyGroup',
    'מספר קבוצה': 'GroupNumber',
    'שם מזמין למסיבה': 'PartyInviterName',
    'פעיל לא פעיל': 'isActive',
    'שדה חופשי': 'FreeFieldsToFillAlone',
    'שדה חופשי 2': 'AnotherFreeFieldToFillAlone',
    'הערות אלפון': 'PhoneNotes',
  };


  const [uploadingData, setUploadingData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate(); 
  const [alfonChangesData, setAlfonChangesData] = useState({}); 
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPeople();
        setRowData(response.data.data.people || {});
  
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (newArray, needsUpdate, updatedNeedsUpdate) => {
    const mergedNeedsUpdate = mergeAndOverride(needsUpdate, updatedNeedsUpdate);
    const combinedArray = [...newArray, ...mergedNeedsUpdate];
    console.log(combinedArray);
    // return

    // Now set the uploading data
    setUploadingData(combinedArray);
    console.log(combinedArray);
  
    try {
      

      const response = await uploadPeople(combinedArray);
      console.log(response);
      setRowData(response.data.people || {});

    } catch (error) {
      console.error(error);
    }
   };


  
  


  const handleFileUpload = async (e) => {
    setLoading(true); // Start loading spinner
    try {
      const file = e.target.files[0];
      if (inputRef.current) {
        inputRef.current.value = ''; // Clears the input value
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
  
        // Using setTimeout to allow UI updates
        setTimeout(async () => {
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
          // Filter out any rows that are entirely empty or contain only empty strings
          json = json.filter(row =>
            row.some(cell => cell !== null && cell !== undefined && cell !== '')
          );
          console.log(json);
  
          setUploadingData(json);
  
          const headers = json[0];
          const rows = json;
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
          console.log(mappedData);
  
          try {
            const response = await getAlfonChanges(mappedData);
            setAlfonChangesData(response.data || []);
            console.log(response.data);
  
          } catch (error) {
            console.error(error);
          }
          setLoading(false); // Stop loading spinner after processing
        }, 0);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      setLoading(false); // Stop loading spinner on error
    }
  };
  
  const mergeAndOverride = (needsUpdate, updatedNeedsUpdate) => {
    console.log(updatedNeedsUpdate);
    
    // Create a map of updatedDocs for quick lookup by anashIdentifier
    const updatedDocsMap = new Map(updatedNeedsUpdate.map(doc => [doc.anashIdentifier, doc]));
    
    const mergedNeedsUpdate = needsUpdate.reduce((acc, needsUpdateObj) => {
      const updateObj = updatedDocsMap.get(needsUpdateObj.anashIdentifier);
      if (updateObj) {
        // Combine properties, with updateObj properties overriding needsUpdateObj
        acc.push({ ...needsUpdateObj, ...updateObj });
      }
      return acc;
    }, []);
      
    return mergedNeedsUpdate;
  };
   
      


return (
  <div className="relative min-h-screen">
  {loading ? (
    <Spinner />
  ) : (
    <>
      {Object.keys(alfonChangesData).length > 0 && (
        <AlfonChanges data={alfonChangesData} handelSubmit={handleSubmit}/>
      )}

      <input type="file" onChange={handleFileUpload} ref={inputRef} id="file" />

      <div>
        {uploadingData.length > 0 && (
          <div>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        )}
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('/add-person')}
          >
            הוסף תורם
          </button>
        </div>
      </div>

      {rowData.length > 0 && <Table rowData={rowData} setRowData={setRowData} />}
    </>
  )}
</div>
);
}

export default AlfonPage;







