import { CgDetailsMore } from "react-icons/cg";
import { useNavigate,useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople,upadateUserDetails ,deleteUser} from '../requests/ApiRequests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


function Table({rowData, setRowData}) {

    const navigate = useNavigate();
    const [originalRowData, setOriginalRowData] = useState({});
    const [searchText, setSearchText] = useState('');

    
    
    const onSearch = (event) => {
      setSearchText(event.target.value);
    };
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
      const ActionCellRenderer = (props) => {
        const isCurrentRowEditing = props.api.getEditingCells().some((cell) => cell.rowIndex === props.node.rowIndex);
    
        if (isCurrentRowEditing) {
            return (
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="action-button update border-2 p-1 w-[100px]" onClick={() => onActionClick('update', props.api, props.node)}>עדכן</button>
                    <button className="action-button cancel border-2 p-1 w-[100px]" onClick={() => onActionClick('cancel', props.api, props.node)}>בטל עדכון</button>
                </div>
            );
        } else {
            return (
                <div style={{ display: 'flex', gap: '15px' }}> 
                    <button className="action-button edit border-2 p-1 w-[100px]" onClick={() => onActionClick('edit', props.api, props.node)}>ערוך שורה</button>
                    <button className="action-button delete border-2 p-1 w-[100px]" onClick={() => onActionClick('delete', props.api, props.node)}>מחק שורה</button>
                </div>
            );
        }
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
            const isConfirmed = window.confirm('האם את/ה בטוח שאת/ה רוצה למחוק?');
            if (isConfirmed) {
              const originalRowData = node.data;
              try {
                const res = await deleteUser(originalRowData.anashIdentifier);
                console.log(res);
                api.applyTransaction({
                  remove: [node.data]
                });
              } catch (error) {
                console.error(error);
              }
            }
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
        
        { headerName: 'מזהה אנש', field: 'anashIdentifier', editable: false, sortable: true, filter: true,width: 120 },
        { headerName: 'שם', field: 'FirstName', editable: true, sortable: true, filter: true },
        { headerName: 'משפחה', field: 'LastName', editable: true, sortable: true, filter: true },
        { headerName: 'כתובת', field: 'Address', editable: true, sortable: true, filter: true },
        { headerName: 'מספר', field: 'adressNumber', editable: true, sortable: true, filter: true,width: 100 },
        { headerName: 'עיר', field: 'City', editable: true, sortable: true, filter: true,width: 100 },
        {
          headerName: 'טל בית',
          field: 'HomePhone',
          editable: true,
          sortable: true,
          filter: true,
          width: 120,
        },   
        {
          headerName: 'פעיל',
          field: 'isActive',
          editable: true,
          width: 80,
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
          headerName: 'עריכה/מחיקה',
          cellRenderer: ActionCellRenderer,
          editable: false,
          colId: 'action',
        },
      ];
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
        height: '78vh', // Adjust based on your layout needs
        overflow: 'auto', // Ensure scrolling within the grid
        margin: '0 auto', // Center the grid
        width: '98vw', // Adjust based on your layout needs
    };
    
  
  return (
    <div>
              <input 
        type="text" 
        placeholder="חיפוש..." 
        value={searchText} 
        onChange={onSearch} 
        className="m-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-100" 

      />

      <div className="ag-theme-alpine" style={gridStyle}>
        {rowData.length > 0 && (
          <AgGridReact

            columnDefs={columns}
            rowData={rowData}
            pagination={true}
            paginationPageSize={50} // Increase the pagination page size as needed
            domLayout="normal" // Use normal layout to keep grid within the container height
            enableRtl={true}
            // onGridReady={onGridReady}
            onRowEditingStarted={onRowEditingStarted}
            onRowEditingStopped={onRowEditingStopped}
            quickFilterText={searchText} // Applying the search text to filter the grid
  

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
  )
}

export default Table