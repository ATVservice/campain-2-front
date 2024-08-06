import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Ensure this path is correct
import { uploadPeople, getPeople } from '../requests/ApiRequests';
import styles from './alfonPage.module.css';

function AlfonPage() {
  const [uploadingData, setUploadingData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPeople();
        setRowData(response.data.data.people || []);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const hebrewToEnglishMapping = useMemo(() => ({
    'מזהה אנש': 'anashIdentifier',
    'שם מלא': 'FullNameForLists',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'שם האב': 'FatherName',
    'מספר זהות': 'IdentityNumber',
    'כתובת': 'Address',
    'מספר': 'adressNumber',
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
  }), []);

  const englishToHebrewMapping = useMemo(() => ({
    'anashIdentifier': 'מזהה אנש',
    'FullNameForLists': 'שם מלא',
    'Address': 'כתובת',
    'adressNumber': 'מספר',
    'City': 'עיר',
    'MobilePhone': 'טל נייד',
    'HomePhone': 'טל בית',
    'CommitteeResponsibility': 'אחראי ועד',
    'PartyGroup': 'קבוצה למסיבה',
    'DonationMethod': 'אופן התרמה',
    'GroupNumber': 'מספר קבוצה',
    'Classification': 'סיווג',
    'isActive': 'פעיל',
    'PersonID': 'קוד לקוח',
  }), []);

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
          if (englishKey === 'isActive' && mappedRow[englishKey] === -1) {
            mappedRow[englishKey] = true;
          } else if (englishKey === 'isActive' && mappedRow[englishKey] === 0) {
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
    console.log(mappedData);
  };

  const handleEditToggle = async (index) => {
    if (editRowIndex === index) {
      try {
        await updatePerson(rowData[index]._id, editedData);
        const updatedData = [...rowData];
        updatedData[index] = { ...rowData[index], ...editedData };
        setRowData(updatedData);
        setEditedData({});
        setEditRowIndex(null);
      } catch (error) {
        console.error('Failed to update person', error);
      }
    } else {
      setEditRowIndex(index);
      setEditedData({ ...rowData[index] });
    }
  };

  const handleInputChange = (header, value) => {
    setEditedData(prevState => ({
      ...prevState,
      [header]: value,
    }));
  };

  const columns = useMemo(() => {
    const baseColumns = Object.keys(englishToHebrewMapping).map(header => ({
      headerName: englishToHebrewMapping[header],
      field: header,
      editable: false, // Initially, cells are not editable
      resizable: true,
      sortable: true,
      filter: true,
      autoHeight: true,
      cellStyle: { padding: '4px' },
      cellRendererFramework: (params) => {
        if (editRowIndex === params.rowIndex) {
          return typeof params.value === 'boolean' ? (
            <input
              type="checkbox"
              checked={params.value}
              onChange={(e) => handleInputChange(params.colDef.field, e.target.checked)}
            />
          ) : (
            <textarea
              value={params.value || ''}
              onChange={(e) => handleInputChange(params.colDef.field, e.target.value)}
            />
          );
        } else {
          return params.value !== undefined ? params.value.toString() : '';
        }
      }
    }));
    return [
      ...baseColumns,
      {
        headerName: 'Actions',
        field: 'actions',
        cellRendererFramework: (params) => (
          <button onClick={() => handleEditToggle(params.node.rowIndex)}>
            {editRowIndex === params.node.rowIndex ? 'End Edit' : 'Edit'}
          </button>
        )
      }
    ];
  }, [englishToHebrewMapping, editRowIndex]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    const allColumnIds = params.columnApi.getAllColumns().map(col => col.getId());
    params.columnApi.autoSizeColumns(allColumnIds, false);
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
      <div className={`ag-theme-alpine ${styles.grid}`} style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={10}
          domLayout='autoHeight'
          enableRtl={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default AlfonPage;










// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { uploadPeople, getPeople } from '../requests/ApiRequests';
// import styles from './alfonPage.module.css';

// function AlfonPage() {
//   const [uploadingData, setUploadingData] = useState([]);
//   const [data, setData] = useState([]);
//   const [editRowIndex, setEditRowIndex] = useState(null);
//   const [editedData, setEditedData] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getPeople();
//         setData(response.data.data.people || []);
//         console.log(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, []);

//   const hebrewToEnglishMapping = {
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

//   const englishToHebrewMapping = {
//     'anashIdentifier': 'מזהה אנש',
//     'FullNameForLists': 'שם מלא',
//     'Address': 'כתובת',
//     'adressNumber': 'מספר',
//     'City': 'עיר',
//     'MobilePhone': 'טל נייד',
//     'HomePhone': 'טל בית',
//     'CommitteeResponsibility': 'אחראי ועד',
//     'PartyGroup': 'קבוצה למסיבה',
//     'DonationMethod': 'אופן התרמה',
//     'GroupNumber': 'מספר קבוצה',
//     'Classification': 'סיווג',
//     'isActive': 'פעיל',
//     'PersonID': 'קוד לקוח',
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const arrayBuffer = event.target.result;
//       const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//       setUploadingData(json);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleSubmit = async () => {
//     const headers = uploadingData[0];
//     const rows = uploadingData;
//     const mappedData = rows.slice(1, 30).map(row => {
//       const mappedRow = {};
//       headers.forEach((header, index) => {
//         const englishKey = hebrewToEnglishMapping[header];
//         if (englishKey) {
//           mappedRow[englishKey] = row[index];
//           if (englishKey === 'isActive' && mappedRow[englishKey] === -1) {
//             mappedRow[englishKey] = true;
//           } else if (englishKey === 'isActive' && mappedRow[englishKey] === 0) {
//             mappedRow[englishKey] = false;
//           }
//         }
//       });
//       return mappedRow;
//     });
//     try {
//       const response = await uploadPeople(mappedData);
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//     }
//     console.log(mappedData);
//   };

//   const handleEditToggle = async (index) => {
//     if (editRowIndex === index) {
//       // Send updated data to the server
//       try {
//         // await updatePerson(data[index]._id, editedData);
//         // Update the local state with the edited data
//         const updatedData = [...data];
//         updatedData[index] = { ...data[index], ...editedData };
//         setData(updatedData);
//         setEditedData({});
//         setEditRowIndex(null);
//       } catch (error) {
//         console.error('Failed to update person', error);
//       }
//     } else {
//       setEditRowIndex(index);
//       setEditedData({ ...data[index] });
//     }
//   };

//   const handleInputChange = (header, value) => {
//     setEditedData(prevState => ({
//       ...prevState,
//       [header]: value,
//     }));
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileUpload} />
//       <div>
//         {uploadingData.length > 0 && (
//           <div>
//             <button onClick={handleSubmit}>Submit</button>
//           </div>
//         )}
//       </div>
//       <div>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               {data.length > 0 && Object.keys(data[0]).map((header, index) => (
//                 <th key={index}>{englishToHebrewMapping[header]}</th>
//               ))}
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.length > 0 && data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {Object.keys(data[0]).map((header, cellIndex) => (
//                   <td key={cellIndex}>
//                     {editRowIndex === rowIndex ? (
//                       typeof row[header] === 'boolean' ? (
//                         <input
//                           type="checkbox"
//                           checked={editedData[header]}
//                           onChange={(e) => handleInputChange(header, e.target.checked)}
//                         />
//                       ) : (
//                         <input
//                           type=''
//                           value={editedData[header] || ''}
//                           onChange={(e) => handleInputChange(header, e.target.value)}
//                         />
//                       )
//                     ) : (
//                       row[header] !== undefined ? row[header] : ''
//                     )}
//                   </td>
//                 ))}
//                 <td>
//                   <button onClick={() => handleEditToggle(rowIndex)}>
//                     {editRowIndex === rowIndex ? 'End Edit' : 'Edit'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default AlfonPage;
