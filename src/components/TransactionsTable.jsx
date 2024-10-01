import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaTrash } from 'react-icons/fa'; // ייבוא האייקון

function TransactionsTable({ rowsData, onDelete }) {
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
      filter: true,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString('he-IL'),
    },
    {
      headerName: 'יתרה נוכחית',
      field: 'currentBalance',
      editable: false,
      sortable: true,
      filter: true,
    },
    {
      headerName: 'מחיקה',
      cellRenderer: (params) => {
        if (params.data.TransactionType === 'הוצאה') {
          return (
            <button
              onClick={() => onDelete(params.data)}
              className="text-red-500 hover:text-red-700"
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
      return { backgroundColor: '#e6ffe6' }; // רקע ירוק בהיר להכנסה
    }
    return null;
  };

  return (
    <div className="ag-theme-alpine" style={gridStyle}>
      <AgGridReact
        columnDefs={columns}
        rowData={rowsData}
        pagination={true}
        paginationPageSize={20}
        domLayout="autoHeight"
        enableRtl={true}
        getRowStyle={getRowStyle}
      />
    </div>
  );
}

export default TransactionsTable;
