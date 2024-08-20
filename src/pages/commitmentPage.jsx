import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import CommitmentForm from '../components/ManualCommitmentForm';
import PaymentForm from '../components/ManualPaymentForm';
import DetailModal from '../components/DetailModal';
// import CommitmentDetailsPage from "./CommitmentDetailsPage";
import { uploadCommitment, getCommitment, uploadPayment } from '../requests/ApiRequests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaTrashAlt } from 'react-icons/fa'; // אייקון מחיקה
import { FaRegEye } from 'react-icons/fa'; // אייקון פרטים נוספים

function CommitmentPage() {
  const [uploadingData, setUploadingData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const navigate = useNavigate();
  const [originalRowData, setOriginalRowData] = useState({});
  const [selectedRowData, setSelectedRowData] = useState(null);

  const hebrewToEnglishMapping = {
    'מזהה אנש': 'AnashIdentifier',
    'מספר זהות': 'PersonID',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'סכום התחייבות': 'CommitmentAmount',
    'סכום שולם': 'AmountPaid',
    'סכום שנותר': 'AmountRemaining',
    'מספר תשלומים': 'NumberOfPayments',
    'תשלומים שבוצעו': 'PaymentsMade',
    'תשלומים שנותרו': 'PaymentsRemaining',
    'מתרים': 'Fundraiser',
    'אופן תשלום': 'PaymentMethod',
    'הערות': 'Notes',
    'תשובה למתרים': 'ResponseToFundraiser',
    'יום הנצחה': 'MemorialDay',
    'הנצחה': 'Commemoration',
    'מספר התחייבות': 'CommitmentNumber',
    'סכום': 'Amount',
    'תאריך': 'Date',
    // 'קמפיין': 'Campaign',
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCommitment();
        setRowData(response.data.data.commitment || []);
      } catch (error) {
        console.error('Error fetching commitments:', error);
      }
    };
    fetchData();
  }, []);

  const commonColumnProps = {
    resizable: true,
    sortable: true,
    filter: true,
    editable: false
  };

  const columns = [
    {
      headerName: 'פרטים מלאים',
      field: 'userDetails',
      editable: false,
      cellRenderer: (params) =>
        
        {
        const handleDetailsClick = () => {
          const _id = params.data._id; // Replace 'id' with the actual field name for the user ID
          console.log(_id);
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
    { headerName: 'הערות', field: 'Notes', width: 150, ...commonColumnProps },
    { headerName: 'תשובה למתרים', field: 'ResponseToFundraiser', width: 150, ...commonColumnProps },
    // {
    //   headerName: '',
    //   cellRendererFramework: (params) => (
    //     <button
    //       onClick={() => handleDelete(params.data)}
    //       className="px-4 py-2 bg-red-500 text-white rounded"
    //     >
    //       מחק
    //     </button>
    //   ),
    //   width: 60,
    //   sortable: false,
    //   filter: false
    // }
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
  const handleAddPaymentClick = () => {
    setIsPaymentFormOpen(true); // Open payment form
  };

  const handleAddCommitmentClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  const handleClosePaymentForm = () => {
    setIsPaymentFormOpen(false); // Close payment form
  };

  const handleFormSubmit = (formData) => {
    // Send the formData to the server here
    console.log('Form data submitted:', formData);
    setIsFormOpen(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setUploadingData(json);
    };
    reader.readAsArrayBuffer(file);
  };
  const handlePaymentFileSubmit = async () => {
    const headers = uploadingData[0];
    const rows = uploadingData;

    const mappedData = rows.slice(1).map(row => {
      const mappedRow = {};
      headers.forEach((header, index) => {
        const englishKey = hebrewToEnglishMapping[header];
        if (englishKey) {
          mappedRow[englishKey] = row[index];
        }
      });
      return mappedRow;
    });
    console.log(mappedData);
    try {
      const response = await uploadPayment(mappedData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const handleFileSubmit = async () => {
    const headers = uploadingData[0];
    const rows = uploadingData;

    const mappedData = rows.slice(1, rows.length).map(row => {
      const mappedRow = {};
      headers.forEach((header, index) => {
        const englishKey = hebrewToEnglishMapping[header];
        if (englishKey) {
          mappedRow[englishKey] = row[index];
        }
      });
      return mappedRow;
    });
    console.log(mappedData);
    try {
      const response = await uploadCommitment(mappedData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
  };
  const handleDeleteCommitment = async (commitmentNumber) => {
    try {
        await deleteCommitment(commitmentNumber); // קריאה ל-API למחיקת התחייבות
        setRowData(prevData => prevData.filter(item => item.CommitmentNumber !== commitmentNumber));
    } catch (error) {
        console.error('Error deleting commitment:', error);
    }
};

  return (
    <div className="commitment-page relative">
      <div className="pr-2 py-2 flex space-x-2">
        <button
          onClick={handleAddCommitmentClick}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          הוספת התחייבות
        </button>
        <button
          onClick={handleAddPaymentClick}
          className="px-4 py-2 bg-green-500 text-white rounded ml-2"
        >
          הוספת תשלום
        </button>
        <input type="file" onChange={handleFileUpload} />
        <button
          onClick={handleFileSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          עדכון התחייבויות
        </button>
        <button
          onClick={handlePaymentFileSubmit}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          עדכון תשלומים
        </button>
      </div>
      {isPaymentFormOpen && (
        <PaymentForm
          onClose={handleClosePaymentForm}
        />
      )}

      {isFormOpen && (
        <CommitmentForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}
      {selectedRowData && (
        <DetailModal
          data={selectedRowData}
          onClose={() => setSelectedRowData(null)}
        />
      )}
      <div className="ag-theme-alpine" style={gridStyle}>
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={50}
          domLayout="normal"
          enableRtl={true}
          onGridReady={onGridReady}
          onRowEditingStarted={onRowEditingStarted}
          onRowEditingStopped={onRowEditingStopped}
          editType="fullRow"
          suppressClickEdit={true}
          defaultColDef={{
            minWidth: 50,
            maxWidth: 300
          }}
          suppressHorizontalScroll={true}
        />
      </div>

    </div>
  );
}

export default CommitmentPage;
