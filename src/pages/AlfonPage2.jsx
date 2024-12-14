import { CgDetailsMore } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople, reviewUploadedPeople } from '../requests/ApiRequests';
import { motion } from 'framer-motion';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import ReviewAlfonChanges from "../components/ReviewAlfonChanges";
import { toast } from "react-toastify";
import { exportToExcel, exportToPDF } from "../../Reports/exportFilesHandler.jsx";
import {hebrewToEnglisAlfonhMapping,englishToHebrewAlfonhMapping} from '../components/Utils'




function AlfonPage2() {
  const [showActivePeople, setShowActivePeople] = useState(true);
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [showConflicts, setShowConflicts] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [conflictsData, setConflictsData] = useState([]);
  const [validPeople, setValidPeople] = useState([]);
  const [invalidPeople, setInvalidPeople] = useState([]);
  const gridRef = useRef(null);


  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPeople(showActivePeople);
        console.log(response);

        setRowsData(response.data.data.people || []);

      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showActivePeople]);




  const handleFileUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (inputRef.current) {
      inputRef.current.value = ''; // Clears the input value
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      json = json.filter(row =>
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );
      const headers = json[0];
      const rows = json;
      const mappedData = rows.slice(1, rows.length).map(row => {
        const mappedRow = {};
        headers.forEach((header, index) => {
          const englishKey = hebrewToEnglisAlfonhMapping[header];
          if (englishKey) {
            mappedRow[englishKey] = row[index];
          }
        });
        return mappedRow;
      });
      // console.log(mappedData);

      await handelReview(mappedData);
      setLoading(false);



    };
    reader.readAsArrayBuffer(file);
  };
  const handelReview = async (mappedData) => {
    try {
      const response = await reviewUploadedPeople(mappedData);

      // Destructure the response data for cleaner access
      const { conflictedPeople = [], validPeople = [], invalidPeople = [] } = response.data || {};

      // Update states conditionally based on the response data
      if (conflictedPeople.length > 0) {
        setShowConflicts(true);
        setConflictsData(conflictedPeople);
      }

      if (validPeople.length > 0) {
        setValidPeople(validPeople);
      }

      if (invalidPeople.length > 0) {
        setInvalidPeople(invalidPeople);
      }

      // Show the modal if any of the data arrays have content
      if (conflictedPeople.length > 0 || validPeople.length > 0 || invalidPeople.length > 0) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error while reviewing uploaded people:", error);
    }

  }

  const handelSubmit = async (chosenPeople, validPeople) => {
    setLoading(true);
    setShowModal(false);
    try {
      const dataToUpload = chosenPeople.concat(validPeople);
      const response = await uploadPeople(dataToUpload);
      console.log(response);
      if (response.status === 200) {
        const response = await getPeople(showActivePeople);
        setRowsData(response.data.data.people || []);
        toast.success("נתונים הועלו בהצלחה");
      }

    } catch (error) {
      console.log(error);
      toast.error("שגיאה בהעלאת נתונים");

    }
    finally {
      setLoading(false);
      resetPeopleArrays();

    }



  }
  function resetPeopleArrays() {
    setValidPeople([]);
    setInvalidPeople([]);
    setConflictsData([]);

  }
  const onCloseModal = () => {
    setShowModal(false);
    resetPeopleArrays();
  };

  const getCurrentGridData = () => {
    if(!gridRef.current || !gridRef.current.api) return 

    const columnOrder = gridRef.current.api
      .getColumnDefs()
      .map((colDef) => colDef.field);
    const rowData = [];

    gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
      const reorderedData = new Map();
      columnOrder.forEach((field) => {
        if (field in node.data) {
          reorderedData.set(field, node.data[field]);
        }
      });

      // Convert Map back to an object with ordered keys
      rowData.push(Object.fromEntries(reorderedData));
    });

    return rowData;
  };



  const handelExportToExcel = () => {

    const data = getCurrentGridData();
    exportToExcel(data,englishToHebrewAlfonhMapping, 'אלפון');
  }
    
  const handelExportToPdf = () => {
    const data = getCurrentGridData();
    exportToPDF(data,englishToHebrewAlfonhMapping, 'אלפון');
  }





  if (loading) return <Spinner />
  return (
    <div className="relative min-h-screen pt-4 pb-2"> {/* Added padding at the top and reduced at the bottom */}

      <>
        <div className="flex items-center mb-2 w-full justify-start gap-4"> {/* Space between buttons */}
          <input
            type="file"
            onChange={handleFileUpload}
            ref={inputRef}
            id="file"
            className="hidden"
          />
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
          <div className="flex gap-4 mr-auto ml-2">
            <button type='button' className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded'
              onClick={handelExportToExcel}
              >
              יצוא דו"ח EXCEL
            </button>
            <button type='button' className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded  '
              onClick={handelExportToPdf}
              >
              יצוא דו"ח PDF
            </button>
          </div>


        </div>
        {<Table rowsData={rowsData} setRowsData={setRowsData} setShowActivePeople={setShowActivePeople}
          showActivePeople={showActivePeople} gridRef={gridRef}/>}
      </>
      {showModal && (
        <ReviewAlfonChanges
          conflictsData={conflictsData}
          validPeople={validPeople}
          invalidPeople={invalidPeople}
          showConflicts={showConflicts}
          setShowConflicts={setShowConflicts}
          onClose={onCloseModal}
          onSubmit={handelSubmit}

        />
      )}



    </div>
  )
}

export default AlfonPage2