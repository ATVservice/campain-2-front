import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaTrash } from 'react-icons/fa'; // ייבוא האייקון
import {deleteTransaction} from '../requests/ApiRequests';
import { set } from 'date-fns';
import {AG_GRID_LOCALE_IL} from '../components/ag-grid-localization';
import { format } from 'date-fns';
function TransactionsTable({ rowsData, fetchTransactions,gridRef}) {
    const [searchText, setSearchText] = useState("");
  

  const columns = [
    {
      headerName: 'סיבת הוצאה/שם',
      field: 'FullNameOrReasonForIssue',
      editable: false,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'סוג תנועה',
      field: 'TransactionType',
      editable: false,
      sortable: true,
      filter: true,
      cellStyle: (params) => {
        return params.value === 'הוצאה' ? { color: 'red' } : { color: 'green' };
      },
    },
    {
      headerName: 'סכום',
      field: 'Amount',
      editable: false,
      sortable: true,
      filter: true,
      cellStyle: (params) => {
        return params.data.TransactionType === 'הוצאה' ? { color: 'red' } : { color: 'green' };
      },
    },
    {
      headerName: 'תאריך',
      field: 'TransactionDate',
      editable: false,
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        // Format the date as you prefer
        if (params.value) {
          return new Date(params.value).toLocaleDateString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          // Or use a specific format like:
          // return moment(params.value).format('DD/MM/YYYY');
        }
        return "";
      },
    
          
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const date = new Date(cellValue);
          
          if (date < filterLocalDateAtMidnight) return -1;
          if (date > filterLocalDateAtMidnight) return 1;
          return 0;
        },
        // Enable all filter types including range
        browserDatePicker: true,
        inRangeInclusive: true,
        defaultOption: 'inRange',

      }
      ,
      getQuickFilterText: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
        return "";
      },

    }
    
    
    ,
    {
      headerName: 'יתרה נוכחית',
      field: 'currentBalance',
      editable: false,
      sortable: true,
      filter: true,
      cellStyle: (params) => {
        return params.value < 0 ? { color: 'red', direction: 'ltr' } : { color: 'green', direction: 'ltr' };
      },
      cellRenderer: (params) => {
        const balance = Math.abs(params.value).toLocaleString(); // הצגת מספרים עם פסיקים
        return params.value < 0 ? `- ₪${balance}` : `₪${balance}`;
      },
    },
    {
      headerName: 'מחיקה',
      flex: 1,
      cellRenderer: (params) => {
        if (params.data.TransactionType === 'הוצאה') {
          return (
            <button
              onClick={() => deleteTransactionProcess(params.node)}
              className="text-red-500 hover:text-red-700 flex-grow"
            >
              <FaTrash size={18} /> {/* שימוש באייקון */}
            </button>
          );
        }
        return null;
      },
    },
  ];

  const gridStyle = {
    width: '100%',
    height: '400px',
    
  };

  const getRowStyle = (params) => {
    if (params.data.TransactionType === 'הוצאה') {
      return { backgroundColor: '#ffe6e6' }; // רקע אדום בהיר להוצאה
    } else if (params.data.TransactionType === 'הכנסה') {
      return { backgroundColor: '#e6ffe6'}; // רקע ירוק בהיר להכנסה
    }
    return null;
  };

  const deleteTransactionProcess = async (node) => {
    console.log(node);
  
    const isConfirmed = window.confirm('האם את/ה בטוח שאת/ה רוצה למחוק?');
            if (isConfirmed) {
              const transaction = node.data;
              const transactionId = transaction._id;             
              try {
                const res = await deleteTransaction(transactionId);
                fetchTransactions();
              } catch (error) {
                console.error(error);
              }
            }
};

  return (
    <div>
            <div className="w-[80vw] flex justify-start">
        <input
          id="search"
          type="text"
          placeholder="חיפוש..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="m-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-100 w-[200px]"
        />
      </div>

      <div className="ag-theme-alpine"       style={{
        width: '100%', // Ensure the container is full width
        height: '400px'
      }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowsData}
          pagination={true}
          paginationPageSize={20}
          domLayout="autoHeight"
          enableRtl={true}
          ref={gridRef}
          getRowStyle={getRowStyle}
          quickFilterText={searchText}


          gridOptions={{
            enableCellTextSelection: true,
            // localeText: AG_GRID_LOCALE_IL
          }}
      
        />
      </div>
    </div>
  );
}

export default TransactionsTable;
