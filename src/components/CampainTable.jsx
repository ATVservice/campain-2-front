import { CgDetailsMore } from "react-icons/cg";
import { useNavigate,useParams } from "react-router-dom";
import React, { useState, useEffect,useRef } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople,upadateUserDetails ,deleteUser} from '../requests/ApiRequests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { max } from "date-fns";


function CampainTable({rowData}) {

    const navigate = useNavigate();
      
    
    
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
        // const isCurrentRowEditing = props.api.getEditingCells().some((cell) => cell.rowIndex === props.node.rowIndex);
    
            return (
                <div style={{ display: 'flex', gap: '15px' }}>
                    {/* <button className="action-button update border-2 p-1 w-[100px]" onClick={() => addToCampain(props.api, props.node)}>הוסף</button> */}
                </div>
            );
        

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
        { headerName: 'כתובת', field: 'Address', editable: true, sortable: true, filter: true ,width: 120 },
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
        // {
        //   headerName: 'הוספה לקמפיין',
        //   cellRenderer: ActionCellRenderer,
        //   editable: false,
        //   colId: 'action',
        // },
      ];
 
      const gridStyle = {
        overflow: 'auto', // Ensure scrolling within the grid
        margin: '0 auto', // Center the grid
        width: '90vw', // Adjust based on your layout needs
    };
    const pageSizeOptions = [20,50];

  
  return (

      <div className="ag-theme-alpine" style={gridStyle}>
      {(
  <AgGridReact
    columnDefs={columns}
    rowData={rowData}
    pagination={true}
    paginationPageSize={20} // Increase the pagination page size as needed
    paginationPageSizeSelector={pageSizeOptions} // this property is not a valid AG Grid property
    domLayout="autoHeight" // Use autoHeight layout to adjust grid height automatically
    enableRtl={true}
    // quickFilterText={searchText} 
    suppressClickEdit={true}
    defaultColDef={{
      filterParams: {
        filterOptions: hebrewFilterOptions,
      },
    }}
  />
)}
      </div>

  )
}

export default CampainTable