import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import React, { useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';




function CommitmentTable({rowsData}) {
    //   const [rowData, setRowData] = useState([]);
      const [gridApi, setGridApi] = useState(null);
      const navigate = useNavigate();
      const [originalRowData, setOriginalRowData] = useState({});
      const [searchText, setSearchText] = useState('');
    
    
      function convertExcelDate(excelDate) {
        // אקסל מתחיל את הספירה מ-1 בינואר 1900, לכן נוסיף את מספר הימים מאז
        const startDate = new Date(1900, 0, 1);
        // הפחתת יומיים עקב ההטיה של אקסל (תיקון יום 29 בפברואר 1900 שאינו קיים)
        const adjustedDate = new Date(startDate.setDate(startDate.getDate() + excelDate - 2));
        return adjustedDate.toISOString(); // המרת התאריך לפורמט ISO
      }
    
    //   useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await getCommitment();
    //         setRowData(response.data.data.commitment || []);
    //       } catch (error) {
    //         console.error('Error fetching commitments:', error);
    //       }
    //     };
    //     fetchData();
    //   }, []);
    
      const commonColumnProps = {
        resizable: true,
        sortable: true,
        filter: true,
        editable: false
      };
    
      const onSearchChange = (e) => {
        setSearchText(e.target.value);
        gridApi.setQuickFilter(e.target.value);
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
        }
      ];
      const columns = [
        {
          headerName: 'פרטים מלאים',
          field: 'userDetails',
          editable: false,
          cellRenderer: (params) => {
            const handleDetailsClick = () => {
              const _id = params.data._id; // Replace 'id' with the actual field name for the user ID
              navigate(`/commitment-details/${_id}`);
            };
    
            return (
              <button onClick={() => handleDetailsClick()}>
                <CgDetailsMore style={{ fontSize: '20px' }} />
              </button>
            );
          },
          width: 70,
          headerComponentParams: {
            displayName: 'פרטים<br>מלאים'
          }
        },
        { headerName: 'מזהה אנש', field: 'AnashIdentifier', width: 80, ...commonColumnProps },
        { headerName: 'מספר זהות', field: 'PersonID', width: 150, ...commonColumnProps },
        { headerName: 'שם', field: 'FirstName', width: 150, ...commonColumnProps },
        { headerName: 'משפחה', field: 'LastName', width: 150, ...commonColumnProps },
        { headerName: 'סכום התחייבות', field: 'CommitmentAmount', width: 80, ...commonColumnProps },
        { headerName: 'סכום שולם', field: 'AmountPaid', width: 80, ...commonColumnProps },
        { headerName: 'סכום שנותר', field: 'AmountRemaining', width: 80, ...commonColumnProps },
        { headerName: 'מספר תשלומים', field: 'NumberOfPayments', width: 80, ...commonColumnProps },
        { headerName: 'תשלומים שבוצעו', field: 'PaymentsMade', width: 80, ...commonColumnProps },
        { headerName: 'תשלומים שנותרו', field: 'PaymentsRemaining', width: 50, ...commonColumnProps },
        { headerName: 'מתרים', field: 'Fundraiser', width: 150, ...commonColumnProps },
        {
          headerName: 'אופן תשלום',
          field: 'PaymentMethod',
          width: 150,
          ...commonColumnProps,
          valueFormatter: (params) => {
            if (params.value === 'DirectDebit') {
              return 'הו"ק בנקאי';
            } else if (params.value === 'DirectDebitCredit') {
              return 'הו"ק אשראי';
            } else {
              return params.value;
            }
          }
        },
        { headerName: 'הערות', field: 'Notes', width: 150, ...commonColumnProps }
    
      ];
    
      const gridOptions = {
        defaultColDef: {
          minWidth: 50,
          maxWidth: 300
        },
        columnDefs: columns,
        domLayout: 'autoHeight',
        suppressHorizontalScroll: true
      };
    
    
    
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
        params.api.refreshCells({
          columns: ["action"],
          rowNodes: [params.node],
          force: true
        });
      };
    
      const gridStyle = {
        height: '84vh',
        overflow: 'auto',
        overflowX: 'hidden',
        margin: '0 auto',
        width: '98vw',
      };
    
  return (

    <div className="ag-theme-alpine" style={gridStyle}>
    <input
          type="text"
          placeholder="חפש..."
          value={searchText}
          onChange={onSearchChange}
          className="mb-2 p-2 border rounded"
        />

    <AgGridReact
      columnDefs={columns}
      rowData={rowsData}
      pagination={true}
      paginationPageSize={50}
      domLayout="normal"
      enableRtl={true}
      onGridReady={onGridReady}
      quickFilterText={searchText}
      defaultColDef={{
        minWidth: 50,
        maxWidth: 300,
        resizable: true,
        sortable: true,
        filter: true,
        editable: false,
        filterParams: {
          filterOptions: hebrewFilterOptions, // Custom Hebrew filter options
        },
      }}
    />
  </div>

  )
}

export default CommitmentTable