import { CgDetailsMore } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { uploadPeople, getPeople, upadateUserDetails, deleteUser } from '../requests/ApiRequests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AG_GRID_LOCALE_IL, translations } from './Utils';
import { FaPencilAlt, FaCheck, FaTimes, FaTrash } from "react-icons/fa";


function Table({ rowData, setRowData }) {
  // console.log(rowData)

  const navigate = useNavigate();
  const [originalRowData, setOriginalRowData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);




  const onSearch = (event) => {
    setSearchText(event.target.value);
  };
  const hebrewToEnglishMapping = {
    'מזהה אנש': 'AnashIdentifier',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'כתובת': 'Address',
    'מספר': 'addressNumber',
    'עיר': 'City',
    'טל נייד': 'MobilePhone',
    'טל בית': 'HomePhone',
    'פעיל': 'isActive',
  };
  const ActionCellRenderer = (props) => {
    const isCurrentRowEditing = props.api.getEditingCells().some((cell) => cell.rowIndex === props.node.rowIndex);
    if (isCurrentRowEditing) {
      return (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '10px 0' }}>
          <button className="action-button update" onClick={() => onActionClick('update', props.api, props.node)}>
            <FaCheck style={{ fontSize: '20px', color: 'green' }} />
          </button>
          <button className="action-button cancel" onClick={() => onActionClick('cancel', props.api, props.node)}>
            <FaTimes style={{ fontSize: '20px', color: 'red' }} />
          </button>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '10px 0' }}>
          <button className="action-button edit" onClick={() => onActionClick('edit', props.api, props.node)}>
            <FaPencilAlt style={{ fontSize: '18px', color: 'blue' }} />
          </button>
          <button className="action-button delete" onClick={() => onActionClick('delete', props.api, props.node)}>
            <FaTrash style={{ fontSize: '18px', color: 'red' }} />
          </button>
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
            const res = await deleteUser(originalRowData.AnashIdentifier);
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
        if (Object.keys(updatedData).length > 0) {
          try {
            editedCells = { ...editedCells, AnashIdentifier: node.data.AnashIdentifier };
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
    { headerName: 'כתובת', field: 'Address', editable: true, sortable: true, filter: true },
    { headerName: 'מספר', field: 'addressNumber', editable: true, sortable: true, filter: true, width: 100 },
    { headerName: 'עיר', field: 'City', editable: true, sortable: true, filter: true, width: 100 },
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
      width: 80,
      field: 'isActive',
      filter: true,
      filterParams: {
        defaultOption: 'true',
      },



      // editable: true,

      // width: 80,
      cellRenderer: (params) => {
        return (
          <input
            id={`isActive-${params.data.AnashIdentifier}`}

            type="checkbox"
            checked={params.value.toString() === 'true'}
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
      width: 120,
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
  const defaultColDef = {
    filterParams: {
      filterOptions: hebrewFilterOptions,

    }
  };
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
    params.api.onFilterChanged();
    params.api.refreshCells();
    params.api.redrawRows();

    // Set the state to true so the filter is not applied again
    setIsFilterApplied(true);

    // Log the final filter model to confirm

  };


  return (
    <div>
      <input
        id="search"
        type="text"
        placeholder="חיפוש..."
        value={searchText}
        onChange={onSearch}
        className="m-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-100"

      />

      <div className="ag-theme-alpine" style={gridStyle}>

        <AgGridReact

          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={50} // Increase the pagination page size as needed
          domLayout="normal" // Use normal layout to keep grid within the container height
          enableRtl={true}
          onRowEditingStarted={onRowEditingStarted}
          onRowEditingStopped={onRowEditingStopped}
          quickFilterText={searchText} // Applying the search text to filter the grid


          editType="fullRow"
          suppressClickEdit={true}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          localeText={translations}


        />

      </div>

    </div>
  )
}

export default Table