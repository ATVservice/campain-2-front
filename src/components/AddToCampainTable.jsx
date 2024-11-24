import { CgDetailsMore } from "react-icons/cg";
import { useNavigate,useParams } from "react-router-dom";
import React, { useState, useEffect,useRef } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople,upadateUserDetails ,deleteUser} from '../requests/ApiRequests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { max } from "date-fns";



  function AddToCampainTable({rowData,onAddPersonToCampain,searchText}) {

    const navigate = useNavigate();
      
    
    
    const hebrewToEnglishMapping = {
        'מזהה אנש': 'AnashIdentifier',
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
    
            return (
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="action-button update border-2 p-1 w-[100px]" onClick={() => addToCampain(props.api, props.node)}>הוסף</button>
                </div>
            );
        

    };
    
    const addToCampain = async (api, node) => {
        const {AnashIdentifier} = node.data

        onAddPersonToCampain(AnashIdentifier);
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
            displayKey: 'endsWith',
            displayName: 'מסתיים ב',
            test: (filterValue, cellValue) => {
                return cellValue != null && cellValue.toString().toLowerCase().endsWith(filterValue.toLowerCase());
            }
        }
    ];
    
      const columns = [
        
        { headerName: 'מזהה אנש', field: 'AnashIdentifier', editable: false, sortable: true, filter: true,width: 120 },
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
        {
          headerName: 'הוספה לקמפיין',
          cellRenderer: ActionCellRenderer,
          editable: false,
          colId: 'action',
        },
      ];
 
      const gridStyle = {
        margin: '0 auto', 
        width: '100%', 
        maxWidth: '90vw', 
            
      };
          const pageSizeOptions = [2,4];
      
      
  
  return (
    <div className="ag-theme-alpine custom-theme" style={gridStyle}>
      {
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={2} // Increase the pagination page size as needed
          paginationPageSizeSelector={pageSizeOptions} // this property is not a valid AG Grid property
          domLayout="autoHeight" // Use autoHeight layout to adjust grid height automatically
          enableRtl={true}
          quickFilterText={searchText} // Applying the search text to filter the grid
          suppressClickEdit={true}
          defaultColDef={{
            filterParams: {
              filterOptions: hebrewFilterOptions,
            },
            flex: 1,
            // headerClass: 'bg-blue-300 text-gray-700',
            minWidth: 100,
          }}
          gridOptions={{
            enableCellTextSelection: true,
          }}

        />
      }
    </div>
  );
}



export default AddToCampainTable