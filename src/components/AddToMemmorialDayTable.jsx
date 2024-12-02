import { CgDetailsMore } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AddMemorialDayToPerson from "../pages/AddMemorialDayToPerson";

function AddToMemmorialDayTable({ rowData, onAddMemorialDayToPerson }) {
  const hebrewToEnglishMapping = {
    "מזהה אנש": "AnashIdentifier",
    שם: "FirstName",
    משפחה: "LastName",
  };

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const onSearch = (event) => {
    console.log(event.target.value);
    setSearchText(event.target.value);

  };


  const hebrewFilterOptions = [
    {
      displayKey: "contains",
      displayName: "מכיל",
      test: (filterValue, cellValue) => {
        return (
          cellValue != null &&
          cellValue
            .toString()
            .toLowerCase()
            .indexOf(filterValue.toLowerCase()) >= 0
        );
      },
    },
    {
      displayKey: "startsWith",
      displayName: "מתחיל ב",
      test: (filterValue, cellValue) => {
        return (
          cellValue != null &&
          cellValue
            .toString()
            .toLowerCase()
            .startsWith(filterValue.toLowerCase())
        );
      },
    },
  ];
  const ActionCellRenderer = (props) => {
    // const isCurrentRowEditing = props.api.getEditingCells().some((cell) => cell.rowIndex === props.node.rowIndex);

    return (
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          className="action-button update border-2 p-1 w-[100px]"
          onClick={() => addMemorialDay(props.api, props.node)}
        >
          הוסף
        </button>
      </div>
    );
  };

  const addMemorialDay = async (api, node) => {
    const { AnashIdentifier } = node.data;
    onAddMemorialDayToPerson(AnashIdentifier);

  };

  const columns = [
    {
      headerName: "מזהה אנש",
      field: "AnashIdentifier",
      editable: false,
      sortable: true,
      filter: true,
      width: 120,
      sort: 'asc'  // This will sort the column from lowest to highest by default

    },
    {
      headerName: "שם",
      field: "FirstName",
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      headerName: "משפחה",
      field: "LastName",
      editable: true,
      sortable: true,
      filter: true,
    },
    {
      headerName: "הוסף יום הנצחה",
      cellRenderer: ActionCellRenderer,
      editable: false,
      colId: "action",
    },
  ];

  const pageSizeOptions = [2, 4];

  return (
    <div>
      <input
        type="text"
        placeholder="חיפוש..."
        value={searchText}
        onChange={onSearch}
        className="block mb-6 p-2 m-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <div className="ag-theme-alpine custom-theme p-2 w-[50vw]">
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
            }}
            gridOptions={{
              enableCellTextSelection: true,
            }}

          />
        }
      </div>
    </div>
  );
}

export default AddToMemmorialDayTable;
