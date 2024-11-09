import { CgDetailsMore } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


function CampainTable({ rowData }) {
  const [gridApi, setGridApi] = useState(null);
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
      displayKey: 'startsWith',
      displayName: 'מתחיל ב',
      test: (filterValue, cellValue) => {
        return cellValue != null && cellValue.toString().toLowerCase().startsWith(filterValue.toLowerCase());
      }
    },
  ];
  const CustomHeader = (props) => {
    return <div dangerouslySetInnerHTML={{ __html: props.displayName }} />;
  };


  const columns = [
    {
      headerName: 'פרטים מלאים',
      field: 'userDetails',
      editable: false,
      cellRenderer: (params) => {
        const handleDetailsClick = () => {
          const AnashIdentifier = params.data.AnashIdentifier; // Replace 'id' with the actual field name for the user ID
          navigate(`/user-details/${AnashIdentifier}`);
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

    { headerName: 'מזהה אנש', field: 'AnashIdentifier', editable: false, sortable: true, filter: true, width: 120 },
    { headerName: 'שם', field: 'FirstName', editable: true, sortable: true, filter: true },
    { headerName: 'משפחה', field: 'LastName', editable: true, sortable: true, filter: true },
    { headerName: 'כתובת', field: 'Address', editable: true, sortable: true, filter: true, width: 120 },
    { headerName: 'מספר', field: 'adressNumber', editable: true, sortable: true, filter: true, width: 100 },
    { headerName: 'עיר', field: 'City', editable: true, sortable: true, filter: true, width: 100 },
    {
      headerName: 'טל בית',
      field: 'HomePhone',
      editable: true,
      sortable: true,
      filter: true,
      width: 120,
    }
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
  const pageSizeOptions = [20, 50];

  const onGridReady = (params) => {
    setGridApi(params.api);

    // Log the filter model to check the current state
    // console.log(params.api);

    // Apply default filter for the 'isActive' column
    params.api.setFilterModel({
      isActive: {
        filterType: 'set',
        values: [true],
      },
    });

    // Log the filter model after setting it

    // Force refresh of grid to ensure filter is applied

  };

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
          //onGridReady={onGridReady}
          // quickFilterText={searchText} 
          suppressClickEdit={true}
          defaultColDef={{
            filterParams: {
              filterOptions: hebrewFilterOptions,
            },
          }}
          gridOptions={{
            enableCellTextSelection: true,
          }}

        />
      )}
    </div>

  )
}

export default CampainTable