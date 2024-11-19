import { CgDetailsMore } from "react-icons/cg";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { deletePersonFromCampain } from '../requests/ApiRequests';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';



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
    const { api, node } = props;
    const { AnashIdentifier, FirstName, LastName } = props.data; // מזהה האנ"ש
    const campainName = props.context.campainName; // קבלת שם הקמפיין מהקונטקסט

    const handleDelete = async () => {
      const personName = `${node.data.FirstName} ${node.data.LastName}`; // שליפת שם מלא מהנתונים
      const isConfirmed = window.confirm(
        `האם אתה בטוח שברצונך למחוק את ${personName} (${AnashIdentifier}) מהקמפיין ${campainName}?`
      );
    
      if (isConfirmed) {
        try {
          const result = await deletePersonFromCampain(AnashIdentifier, campainName);
    
          // אם התגובה מכילה את הודעת השגיאה מהשרת
          if (result && result.message) {
            toast.error(result.message);  // מציג את הודעת השגיאה שהשרת מחזיר
          } else if (result && result.status === 200) {
            // מחיקת הנתונים מהטבלה
            api.applyTransaction({ remove: [node.data] });
    
            // הודעת הצלחה
            toast.success(`האנ"ש ${personName} (${AnashIdentifier}) נמחק בהצלחה מ${campainName}`);
          }הקמפ
        } catch (error) {
          console.error(error);
          // אם קרתה שגיאה בלתי צפויה בקריאה ל־API
          toast.error('שגיאה בלתי צפויה במחיקה.');
        }
      }
    };
    

    return (
      <button
        className="action-button delete p-1 px-2 text-xl bg-red-100 rounded-sm"
        onClick={handleDelete}
      >
        <AiOutlineDelete />
      </button>
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
          const AnashIdentifier = params.data.AnashIdentifier;
          navigate(`/user-details/${AnashIdentifier}`);
        };

        return (
          <div
            onClick={() => handleDetailsClick()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          >
            <CgDetailsMore style={{ fontSize: '20px' }} />
          </div>
        );
      },
      width: 70,
      headerComponent: CustomHeader,
      headerComponentParams: {
        displayName: 'פרטים<br>מלאים',
      },
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
    },
    {
      headerName: 'מחיקה',
      cellRenderer: ActionCellRenderer,
      editable: false,
      colId: 'action',
      width: 80,
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
          context={{ campainName: useParams().campainName }}
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