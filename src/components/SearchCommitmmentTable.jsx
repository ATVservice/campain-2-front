import React, { useState, useEffect,useRef } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople,upadateUserDetails ,deleteUser} from '../requests/ApiRequests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { MdDownloadDone } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";




function SearchCommitmmentTable({rowData,searchText ,onSelectRow,onUnselectRow}) {
  const [selectedRow, setSelectedRow] = useState(null);
    const ActionCellRenderer = (props) => {
      const handelSelect = () => {
        // Update the whole row data instead
        console.log(props.data);
        setSelectedRow(props.data);
        onSelectRow(props.data);
      };
      const handelUnselect = () => {
        setSelectedRow(null);
        onUnselectRow();
      };
  
          return props.data.AnashIdentifier === selectedRow?.AnashIdentifier ? 
            <div >
                <button onClick={() => handelUnselect()}
                className="text-2xl hover:text-3xl">
                  <TiDeleteOutline />
                </button>
            </div>
          :
              <div >
                  <button onClick={() => handelSelect()}
                  className="text-2xl hover:text-3xl">
                    <MdDownloadDone />
                  </button>
              </div>
      

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
    
    { headerName: 'מזהה אנש', field: 'AnashIdentifier', editable: false, sortable: true, filter: true,width: 110,  sort: 'asc'  // This will sort the column from lowest to highest by default
    },
    { headerName: 'שם', field: 'FirstName', editable: true, sortable: true, filter: true ,width: 110},
    { headerName: 'משפחה', field: 'LastName', editable: true, sortable: true, filter: true ,width: 110},
    {
      headerName: '',
      cellRenderer: ActionCellRenderer,
      editable: false,
      colId: 'action',
      width: 20,
      flex: 1
    },
    {
      field: 'isSelected',
      hide: true  // This column won't be visible
  }


  ];

  const gridStyle = {
    height: '100px',
    width: 'fit-content',
    margin: '0 auto',
    

};
    const pageSizeOptions = [1,2,4];
  
    const customStyles = `
    .ag-theme-alpine {
        --ag-row-height: 32px;
        --ag-header-height: 32px;
        --ag-list-item-height: 20px;
        --ag-grid-size: 3px;
        --ag-row-border-width: 1px;
    }
    
    .ag-theme-alpine .ag-center-cols-container {
        min-height: unset !important;
    }
    `;
    

return (
  <>
  <style>{customStyles}</style>

<div className="ag-theme-alpine custom-theme" style={gridStyle}>
  {
    <AgGridReact
    headerHeight={32} // makes the header more compact
    rowHeight={32}

      columnDefs={columns}
      rowData={rowData}
      pagination={true}
      paginationPageSize={1} // Increase the pagination page size as needed
      paginationPageSizeSelector={pageSizeOptions}
      enableRtl={true}
      quickFilterText={searchText} 
      // domLayout='autoHeight'
      // domLayout='print'
      suppressClickEdit={true}
      defaultColDef={{
        filterParams: {
          filterOptions: hebrewFilterOptions,
          
        },
      }}
      gridOptions={{
        enableCellTextSelection: true,
      }}
      getRowClass={(params) => {
        // Return Tailwind classes based on your condition
        return params.data.AnashIdentifier===selectedRow?.AnashIdentifier ? 'bg-emerald-300' : '';  // or any other Tailwind color class

    }}


    />
  }
</div>
</>
);
}


export default SearchCommitmmentTable
    
    
    
  
      
      
      
      
      
      