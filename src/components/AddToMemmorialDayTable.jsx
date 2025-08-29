import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { MdFileDownloadDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function AddToMemmorialDayTable({typeKey, rowData, handelSelectPerson }) {
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
          className="action-button update border-2 p-1 w-[100%]"
          onClick={() => addMemorialDay(props.api, props.node)}
        >
            <MdFileDownloadDone className="text-2xl"/>
        </button>
      </div>
    );
  };

  const addMemorialDay = async (api, node) => {
    handelSelectPerson(node.data, typeKey);

  };

  const columns = [
    {
      headerName: "מזהה אנש",
      field: "AnashIdentifier",
  
      sort: 'asc',  // This will sort the column from lowest to highest by default
      width: 100,

    },
    {
      headerName: "שם",
      field: "FirstName",
      minWidth: 70,
      width: 120,
      flex:1

    
    },
    {
      headerName: "משפחה",
      field: "LastName",
      minWidth: 70,
      width: 120,
      flex:1
    },
  
    {
      headerName: "הוסף",
      cellRenderer: ActionCellRenderer,
      colId: "action",
      width: 80,
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
        className="block mb-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <div className="ag-theme-alpine custom-theme max-w-[100%] h-[100px]">
        {
          <AgGridReact
         
            columnDefs={columns}
            rowData={rowData}
           // pagination={true}
           // paginationPageSize={2} // Increase the pagination page size as needed
           // paginationPageSizeSelector={pageSizeOptions} // this property is not a valid AG Grid property
            //domLayout="autoHeight" // Use autoHeight layout to adjust grid height automatically
            domLayout="normal"
            enableRtl={true}
              quickFilterText={searchText} // Applying the search text to filter the grid
            suppressClickEdit={true}
            defaultColDef={
              {
                // flex: 1,
              filterParams: {
                filterOptions: hebrewFilterOptions,
              },
            }}
            gridOptions={{
              enableCellTextSelection: true,
                              localeText:{
                      noRowsToShow: 'אין שורות להצגה'

                }

            }}
            suppressNoRowsOverlay={true}

          />
        }
      </div>
    </div>
  );
}

export default AddToMemmorialDayTable;
