








import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople,upadateUserDetails } from '../requests/ApiRequests';
import styles from './alfonPage.module.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function AlfonPage() {

  const [uploadingData, setUploadingData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const navigate = useNavigate();
  const [originalRowData, setOriginalRowData] = useState({});

  let editedCells = {};

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

  const hebrewToEnglishMapping = {
    'מזהה אנש': 'anashIdentifier',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'כתובת': 'Address',
    'מספר': 'adressNumber',
    'עיר': 'City',
    'טל נייד': 'MobilePhone',
    'טל בית': 'HomePhone',
    'פעיל': 'isActive',
  };
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

const ActionCellRenderer = (props) => {
    const isCurrentRowEditing = props.api.getEditingCells().some((cell) => cell.rowIndex === props.node.rowIndex);

    if (isCurrentRowEditing) {
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button className="action-button update" onClick={() => onActionClick('update', props.api, props.node)}>Update</button>
                <button className="action-button cancel" onClick={() => onActionClick('cancel', props.api, props.node)}>Cancel</button>
            </div>
        );
    } else {
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button className="action-button edit" onClick={() => onActionClick('edit', props.api, props.node)}>Edit</button>
                <button className="action-button delete" onClick={() => onActionClick('delete', props.api, props.node)}>Delete</button>
            </div>
        );
    }
};

  const CheckboxCellRenderer = (props) => {
    const handleCheckboxChange = (event) => {
      const updatedValue = event.target.checked;
      props.node.setDataValue(props.colDef.field, updatedValue);
    };
  
    return (
      <input
        type="checkbox"
        checked={props.value}
        onChange={handleCheckboxChange}
      />
    );
  };
  
  const onActionClick = async (action, api, node) => {
    switch (action) {
      case 'edit':
        api.startEditingCell({
          rowIndex: node.rowIndex,
          colKey: api.getColumnDefs()[0].field // Use the first column's field as the starting edit cell
        });
        break;
      case 'delete':
        api.applyTransaction({
          remove: [node.data]
        });
        break;
      case 'update':
        api.stopEditing(false);
        const updatedData = node.data; // Get the updated row data
        let editedCells = {};
  
        // Compare original data with updated data
        Object.keys(updatedData).forEach((key) => {
          if (updatedData[key] !== originalRowData[key]) {
            editedCells[key] = updatedData[key]; // Store only the changed cells
          }
        });
        console.log(Object.keys(updatedData).length);
        if ( Object.keys(updatedData).length > 0) {
          try {
           editedCells = {...editedCells,anashIdentifier:node.data.anashIdentifier};
            const res = await upadateUserDetails(editedCells);
            console.log(res);
          } catch (error) {
            console.error(error);
          }
          
        }
  
        console.log('Edited cells:', editedCells); // Log or process the edited cells
  
        break;
      case 'cancel':
        api.stopEditing(true);
        break;
    }
  };
  const hebrewFilterOptions = [
    {
        displayKey: 'contains',
        displayName: 'מכיל',
        test: (filterValue, cellValue) => {
            return cellValue != null && cellValue.toString().toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
        }
    },
    {
        displayKey: 'notContains',
        displayName: 'לא מכיל',
        test: (filterValue, cellValue) => {
            return cellValue != null && cellValue.toString().toLowerCase().indexOf(filterValue.toLowerCase()) === -1;
        }
    },
    {
        displayKey: 'startsWith',
        displayName: 'מתחיל ב',
        test: (filterValue, cellValue) => {
            return cellValue != null && cellValue.toString().toLowerCase().startsWith(filterValue.toLowerCase());
        }
    },
    {
        displayKey: 'endsWith',
        displayName: 'מסתיים ב',
        test: (filterValue, cellValue) => {
            return cellValue != null && cellValue.toString().toLowerCase().endsWith(filterValue.toLowerCase());
        }
    }
];
const CustomHeader = (props) => {
  return <div dangerouslySetInnerHTML={{ __html: props.displayName }} />;
};


  const columns = [
    {
      headerName: 'פרטים מלאים',
      field: 'userDetails',
      editable: false,
      cellRenderer: (params) =>
        
        {
        const handleDetailsClick = () => {
          const anashIdentifier = params.data.anashIdentifier; // Replace 'id' with the actual field name for the user ID
          navigate(`/user-details/${anashIdentifier}`);
        };
  
        return (
          <button onClick={() => handleDetailsClick()}>
            <CgDetailsMore style={{ fontSize: '20px' }} />
          </button>
        );  
      },
      width: 70,
      headerComponent: CustomHeader,
      headerComponentParams: {
        displayName: 'פרטים<br>מלאים'
      }
    },
    
    { headerName: 'מזהה אנש', field: 'anashIdentifier', editable: false, sortable: true, filter: true },
    { headerName: 'שם', field: 'FirstName', editable: true, sortable: true, filter: true },
    { headerName: 'משפחה', field: 'LastName', editable: true, sortable: true, filter: true },
    { headerName: 'כתובת', field: 'Address', editable: true, sortable: true, filter: true },
    { headerName: 'מספר', field: 'adressNumber', editable: true, sortable: true, filter: true },
    { headerName: 'עיר', field: 'City', editable: true, sortable: true, filter: true },
    {
      headerName: 'טל בית',
      field: 'HomePhone',
      editable: true,
      sortable: true,
      filter: true,
    },   
    {
      headerName: 'פעיל',
      field: 'isActive',
      editable: true,
      width: 100,
      cellRenderer: (params) => {
        return (
          <input 
            type="checkbox" 
            checked={params.value} 
            disabled 
            style={{ 
              width: '15px', 
              height: '15px', 
              margin: 'auto' 
            }}
    
          />
        );
          },
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ];
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onRowEditingStarted = (params) => {
    const originalData = { ...params.data }; // Clone the original row data
    setOriginalRowData(originalData);
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };
  
  const onRowEditingStopped = (params) => {
    // console.log(params.node);
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  };
  const gridStyle = {
    height: '80vh', // Adjust based on your layout needs
    overflow: 'auto', // Ensure scrolling within the grid
    margin: '0 auto', // Center the grid
    width: '95vw', // Adjust based on your layout needs
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
      <div className="ag-theme-alpine" style={gridStyle}>
        {rowData.length > 0 && (
          <AgGridReact

            columnDefs={columns}
            rowData={rowData}
            pagination={true}
            paginationPageSize={50} // Increase the pagination page size as needed
            domLayout="normal" // Use normal layout to keep grid within the container height
            enableRtl={true}
            onGridReady={onGridReady}
            onRowEditingStarted={onRowEditingStarted}
            onRowEditingStopped={onRowEditingStopped}
            editType="fullRow"
            suppressClickEdit={true}
            defaultColDef={{ filterParams: {
              filterOptions: hebrewFilterOptions
          }}
      }
            
          />
        )}
      </div>
    </div>
  );
}

export default AlfonPage;





