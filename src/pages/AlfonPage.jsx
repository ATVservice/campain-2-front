import { CgDetailsMore } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople, upadateUserDetails, deleteUser, getAlfonChanges } from '../requests/ApiRequests';
import styles from './alfonPage.module.css';
import AlfonChanges from "../components/AlfonChanges";
import { motion } from 'framer-motion';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import InvalidUploads from "../components/InvalidUploads";
function AlfonPage() {
  const hebrewToEnglishMapping = {
    'מזהה אנש': 'AnashIdentifier',
    'שם מלא': 'FullNameForLists',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'שם האב': 'FatherName',
    'מספר זהות': 'PersonID',
    'כתובת': 'Address',
    'מספר': 'AddressNumber',
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
  const [invalidUploads, setInvalidUploads] = useState([]);
  const [errorUploads, setErrorUploads] = useState([]);
  const [succesCount, setSuccesCount] = useState(0);
  const [existingCount, setExistingCount] = useState(0);
  const [newCount, setNewCount] = useState(0);


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
  const handleSubmit = async (newArray, needsUpdate, updatedNeedsUpdate, invalidPeople) => {
    const mergedNeedsUpdate = mergeAndOverride(needsUpdate, updatedNeedsUpdate);
    let combinedArray = [...newArray, ...mergedNeedsUpdate];
    // return

    // Now set the uploading data
    setUploadingData(combinedArray);

    console.log(invalidPeople);

    try {


      const response = await uploadPeople(combinedArray);
      console.log(response);
      setRowData(response.data.people || {});
      setErrorUploads(response.data.errorUploads || []);
      setInvalidUploads(invalidPeople || []);
      setSuccesCount(response.data.successCount || 0);
      setExistingCount(response.data.updatedDocCount || 0);
      setNewCount(response.data.newDocCount || 0);


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
            console.log(response);

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

    // Create a map of updatedDocs for quick lookup by AnashIdentifier
    const updatedDocsMap = new Map(updatedNeedsUpdate.map(doc => [doc.AnashIdentifier, doc]));

    const mergedNeedsUpdate = needsUpdate.reduce((acc, needsUpdateObj) => {
      const updateObj = updatedDocsMap.get(needsUpdateObj.AnashIdentifier);
      if (updateObj) {
        // Combine properties, with updateObj properties overriding needsUpdateObj
        acc.push({ ...needsUpdateObj, ...updateObj });
      }
      return acc;
    }, []);

    return mergedNeedsUpdate;
  };
  return (
    <div className="relative min-h-screen pt-4 pb-2"> {/* Added padding at the top and reduced at the bottom */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          {(invalidUploads.length > 0 || errorUploads.length > 0 || succesCount > 0) && (
            <InvalidUploads
              invalidUploads={invalidUploads}
              errorUploads={errorUploads}
              succesCount={succesCount}
              existingCount={existingCount}
              newCount={newCount}
            />
          )}
          {Object.keys(alfonChangesData).length > 0 && (
            <AlfonChanges data={alfonChangesData} handelSubmit={handleSubmit} />
          )}
          <div className="flex items-center mb-2 space-x-4"> {/* Space between buttons */}
            {/* Hidden file input */}
            <input
              type="file"
              onChange={handleFileUpload}
              ref={inputRef}
              id="file"
              className="hidden"
            />
            {/* Custom file input button with Framer Motion */}
            <motion.label
              htmlFor="file"
              className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-2 px-6 rounded-[10%] shadow-lg hover:shadow-2xl transform transition-transform duration-300"
              style={{ marginRight: '16px' }} // You can set a specific pixel value for more control
              whileHover={{ scale: 1.1, backgroundColor: '#6B46C1' }}
              whileTap={{ scale: 0.9 }}
            >
              בחר קובץ
            </motion.label>
            {/* Added margin left to the button to create space from the file input button */}
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-6 rounded-[10%] shadow-lg hover:shadow-2xl transform transition-transform duration-300" // Remove margin left here to keep consistent spacing
              onClick={() => navigate('/add-person')}
              whileHover={{ scale: 1.1, backgroundColor: '#2563EB' }} // Change to a darker blue on hover
              whileTap={{ scale: 0.9 }} // Scale effect on tap
            >
              הוסף תורם
            </motion.button>
          </div>
          {rowData?.length > 0 && <Table rowData={rowData} setRowData={setRowData} />}
        </>
      )}
    </div>
  );

}

export default AlfonPage;






