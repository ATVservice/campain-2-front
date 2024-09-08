import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import CommitmentForm from '../components/ManualCommitmentForm';
import PaymentForm from '../components/ManualPaymentForm';
import DetailModal from '../components/DetailModal';
import { uploadCommitment, getCommitment, uploadPayment, updateCommitmentDetails, getCommitmentDetails, getCampains } from '../requests/ApiRequests';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function CommitmentPage() {
  const [uploadingData, setUploadingData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const navigate = useNavigate();
  const [originalRowData, setOriginalRowData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [feedbackData, setFeedbackData] = useState(null);

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
    'מספר התחייבות': 'CommitmentId',
    'סכום': 'Amount',
    'תאריך': 'Date',
    'קמפיין': 'CampainName'

  };

  function convertExcelDate(excelDate) {
    // אקסל מתחיל את הספירה מ-1 בינואר 1900, לכן נוסיף את מספר הימים מאז
    const startDate = new Date(1900, 0, 1);
    // הפחתת יומיים עקב ההטיה של אקסל (תיקון יום 29 בפברואר 1900 שאינו קיים)
    const adjustedDate = new Date(startDate.setDate(startDate.getDate() + excelDate - 2));
    return adjustedDate.toISOString(); // המרת התאריך לפורמט ISO
  }

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

  const showFeedbackModal = (data) => {
    setFeedbackData(data);
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackData(null);
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
          if (englishKey === 'Date' && typeof row[index] === 'number') {
            mappedRow[englishKey] = convertExcelDate(row[index]);
          } else {
            mappedRow[englishKey] = row[index];
          }
        }
      });
      return mappedRow;
    });
    console.log("Data being sent to server:", mappedData);
    let successData = [];
    let failedData = [];

    for (const row of mappedData) {
      try {
        const commitmentId = row.CommitmentId || 'N/A';
        const paymentAmount = row.Amount || 0;

        // Execute the update and retrieve additional details
        const commitmentDetails = await updateCommitmentAfterPayment(commitmentId, paymentAmount);

        // אם העדכון הצליח, מוסיף את התשלום
        const response = await uploadPayment([row]);
        successData.push({
          commitmentId,
          paymentAmount,
          status: 'success',
          message: 'העדכון ותשלום ההתחייבות הצליחו'
        });
      } catch (error) {
        // תרגום סיבות השגיאה לעברית
        let reasonInHebrew = '';
        const errorMessage = error.error?.message || error.message || '';

        if (errorMessage.includes('Payment amount exceeds remaining amount')) {
          reasonInHebrew = 'סכום התשלום חורג מהיתרה הקיימת בהתחייבות.';
        } else if (errorMessage.includes('Commitment not found')) {
          reasonInHebrew = 'ההתחייבות לא נמצאה.';
        } else if (errorMessage.includes('מספר התשלומים הנותרים לא יכול להיות פחות מאפס')) {
          reasonInHebrew = 'מספר התשלומים הנותרים לא יכול להיות פחות מאפס';
        } else if (errorMessage.includes('מספר התשלומים בפועל לא יכול לעלות על מספר התשלומים הכולל')) {
          reasonInHebrew = 'מספר התשלומים בפועל לא יכול לעלות על מספר התשלומים הכולל';
        } else {
          reasonInHebrew = 'אירעה שגיאה במהלך עדכון ההתחייבות או הוספת התשלום.';
        }

        console.log(row);
        console.log(error);

        // הוספת פרטי השגיאה לרשימת הכישלונות כולל הפרטים הנדרשים
        failedData.push({
          AnashIdentifier: error.commitmentDetails?.AnashIdentifier || 'N/A',
          PersonID: error.commitmentDetails?.PersonID || 'N/A',
          FirstName: error.commitmentDetails?.FirstName || 'N/A',
          LastName: error.commitmentDetails?.LastName || 'N/A',
          commitmentId: row.CommitmentId || 'N/A',
          paymentAmount: row.Amount || 0,
          status: 'failure',
          reason: reasonInHebrew
        });
      }
    }

    // הצגת המודל עם המידע על ההצלחות והכישלונות
    showFeedbackModal({ success: successData, failed: failedData });
  };

  const updateCommitmentAfterPayment = async (commitmentId, paymentAmount) => {
    let commitment; // Declare the commitment variable outside the try block
    try {
      const response = await getCommitmentDetails(commitmentId);

      commitment = response.data.commitmentDetails; // Assign value to commitment here
      if (!commitment) {
        throw new Error('Commitment not found');
      }

      const updatedAmountPaid = (commitment.AmountPaid || 0) + paymentAmount;
      const updatedAmountRemaining = (commitment.CommitmentAmount || 0) - updatedAmountPaid;
      const updatedPaymentsMade = (commitment.PaymentsMade || 0) + 1;
      const updatedPaymentsRemaining = (commitment.PaymentsRemaining || 0) - 1;

      if (updatedAmountRemaining < 0) {
        throw new Error('Payment amount exceeds remaining amount');
      }

      if (updatedPaymentsRemaining < 0) {
        throw new Error('מספר התשלומים הנותרים לא יכול להיות פחות מאפס');
      }
      if (updatedPaymentsMade > commitment.NumberOfPayments) {
        throw new Error('מספר התשלומים בפועל לא יכול לעלות על מספר התשלומים הכולל');
      }

      await updateCommitmentDetails(commitmentId, {
        AmountPaid: updatedAmountPaid,
        AmountRemaining: updatedAmountRemaining,
        PaymentsMade: updatedPaymentsMade,
        PaymentsRemaining: updatedPaymentsRemaining,
      });

      const updatedRowData = rowData.map((row) => {
        if (row._id === commitmentId) {
          return {
            ...row,
            AmountPaid: updatedAmountPaid,
            AmountRemaining: updatedAmountRemaining,
            PaymentsMade: updatedPaymentsMade,
            PaymentsRemaining: updatedPaymentsRemaining,
          };
        }
        return row;
      });

      setRowData(updatedRowData);
      return {
        AnashIdentifier: commitment.AnashIdentifier,
        PersonID: commitment.PersonID,
        FirstName: commitment.FirstName,
        LastName: commitment.LastName,
      };
    } catch (error) {
      const commitmentDetails = {
        AnashIdentifier: commitment?.AnashIdentifier || 'N/A',
        PersonID: commitment?.PersonID || 'N/A',
        FirstName: commitment?.FirstName || 'N/A',
        LastName: commitment?.LastName || 'N/A',
      };
      console.error('Error updating commitment after payment:', error);
      throw { error, commitmentDetails }; // זרוק את השגיאה עם הפרטים
    }
  };


  const handleFileSubmit = async () => {
    const headers = uploadingData[0];
    const rows = uploadingData.slice(1);

    let successData = [];
    let failedData = [];

    // מיפוי הנתונים
    const mappedData = rows.map(row => {
      const mappedRow = {};
      headers.forEach((header, index) => {
        const englishKey = hebrewToEnglishMapping[header];
        if (englishKey) {
          if (row[index] === '' || row[index] == null) {
            // הוספת ערכים ברירת מחדל
            if (englishKey === 'AmountRemaining') {
              mappedRow[englishKey] = mappedRow['CommitmentAmount'] || 0;
            } else if (englishKey === 'AmountPaid') {
              mappedRow[englishKey] = 0;
            } else if (englishKey === 'PaymentsRemaining') {
              mappedRow[englishKey] = mappedRow['NumberOfPayments'] || 0;
            } else if (englishKey === 'PaymentsMade') {
              mappedRow[englishKey] = 0;
            } else {
              mappedRow[englishKey] = '';
            }
          } else {
            mappedRow[englishKey] = row[index];
          }
        }
      });

      // בדיקות נוספות לפני הוספת הנתונים
      try {
        if (mappedRow['AmountRemaining'] <= 0) {
          throw new Error('לא ניתן להוסיף התחייבות כיוון שסכום שנותר לתשלומים אפס.');
        }
        if (mappedRow['CommitmentAmount'] < mappedRow['AmountPaid']) {
          throw new Error('סכום התחייבות לא יכול להיות קטן מסכום ששולם.');
        }
        if (mappedRow['NumberOfPayments'] < mappedRow['PaymentsMade']) {
          throw new Error('מספר התשלומים לא יכול להיות קטן ממספר התשלומים שבוצעו.');
        }
        return mappedRow;
      } catch (error) {
        failedData.push({ ...mappedRow, reason: error.message });
        return null;
      }
    }).filter(row => row !== null);
    // בדיקת קיום הקמפיינים
    const excelCampaignNames = Array.from(new Set(mappedData.map(data => data['CampainName'])));
    console.log('Campaign names from Excel:', excelCampaignNames);

    // בדיקת קיום הקמפיינים
    try {
      const response = await getCampains(); // קבלת כל הקמפיינים מהפונקציה

      console.log('Campaigns response:', response); // הוספת לוג לבדיקת התשובה

      // גישה לשדה שמכיל את המערך
      const campaigns = response.data.data.campains || []; // ניגש ל-campains מתוך הנתונים

      if (!Array.isArray(campaigns)) {
        throw new Error('הנתונים מהשרת אינם במבנה של מערך.');
      }

      // לוג שמות הקמפיינים מהשרת
      const existingCampaignNames = campaigns.map(campaign => campaign.campainName);
      console.log('Campaign names from server:', existingCampaignNames);

      const invalidCampaigns = mappedData.filter(data => !existingCampaignNames.includes(data['CampainName']));

      if (invalidCampaigns.length > 0) {
        failedData.push(...invalidCampaigns.map(data => ({
          ...data,
          reason: 'שם הקמפיין אינו קיים במערכת.',
        })));
      }

      // הצגת שגיאות מהבדיקות המקומיות במודל
      if (failedData.length > 0) {
        showFeedbackModal({ success: [], failed: failedData });
        return;
      }

      try {
        console.log(mappedData);

        const response = await uploadCommitment(mappedData);
        console.log(response);

        if (response && response.data) {
          const { successfulCommitments = [], failedCommitments = [] } = response.data;

          // עיבוד נתוני ההצלחה
          successData = successfulCommitments.map(commitment => ({
            CommitmentId: commitment._id, // Assuming the ID field is '_id'
            Amount: commitment.Amount || 0 // Assuming there's an 'Amount' field in commitment
          }));

          // עיבוד נתוני הכישלון
          failedData = failedCommitments.map(failed => ({
            AnashIdentifier: failed.AnashIdentifier || 'N/A',
            PersonID: failed.PersonID || 'N/A',
            FirstName: failed.FirstName || 'N/A',
            LastName: failed.LastName || 'N/A',
            CommitmentId: failed._id || 'N/A', // If there's no ID, return 'N/A'
            Amount: failed.Amount || 0,
            reason: failed.reason || 'שגיאה לא ידועה'
          }));

          // הצגת המידע במודל
          showFeedbackModal({ success: successData, failed: failedData });
        } else {
          console.error('Unexpected response structure:', response);
          showFeedbackModal({ success: [], failed: mappedData.map(row => ({ ...row, reason: 'תגובה לא תקינה מהשרת' })) });
        }
      } catch (error) {
        console.error('Error uploading commitments:', error);
        showFeedbackModal({ success: [], failed: mappedData.map(row => ({ ...row, reason: 'העלאה נכשלה' })) });
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showFeedbackModal({ success: [], failed: mappedData.map(row => ({ ...row, reason: 'שגיאה בקבלת קמפיינים' })) });
    }
  };

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
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
        <input
          type="text"
          placeholder="חפש..."
          value={searchText}
          onChange={onSearchChange}
          className="mb-2 p-2 border rounded"
        />
      </div>
      {isPaymentFormOpen && (
        <PaymentForm
          onClose={handleClosePaymentForm} rowData={rowData} updateCommitmentAfterPayment={updateCommitmentAfterPayment} getCommitmentDetails={getCommitmentDetails}
        />
      )}

      {isFormOpen && (
        <CommitmentForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
      )}
      {feedbackData && (
        <DetailModal
          data={feedbackData}
          onClose={handleCloseFeedbackModal}
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
    </div>
  );
}

export default CommitmentPage;
