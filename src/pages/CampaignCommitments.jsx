import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect,useRef } from 'react';
import * as XLSX from 'xlsx';
import CommitmentForm from '../components/ManualCommitmentForm';
import PaymentForm from '../components/ManualPaymentForm';
import DetailModal from '../components/DetailModal';
import { getCommitmentsByCampaign, uploadCommitment, uploadCommitmentPayment, getCampains } from '../requests/ApiRequests'; // הפונקציה המעודכנת
import CommitmentTable from "../components/CommitmentTable";

function CampaignCommitments() {  
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
      const { campainName } = useParams();// מקבל את מזהה הקמפיין מ-URL
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
      const fileRef = useRef(null);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCommitmentsByCampaign();
                console.log(response.data.data.commitment);

                setRowData(response.data.data.commitment || []);
            } catch (error) {
                console.error('Error fetching campaign commitments:', error);
            }
        };

        fetchData();
    }, []);

    function convertExcelDate(excelDate) {
        // אקסל מתחיל את הספירה מ-1 בינואר 1900, לכן נוסיף את מספר הימים מאז
        const startDate = new Date(1900, 0, 1);
        // הפחתת יומיים עקב ההטיה של אקסל (תיקון יום 29 בפברואר 1900 שאינו קיים)
        const adjustedDate = new Date(startDate.setDate(startDate.getDate() + excelDate - 2));
        return adjustedDate.toISOString(); // המרת התאריך לפורמט ISO
      }
    
    
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
    
      function validatePayment(commitment, paymentAmount) {
        console.log(commitment);
        console.log('enter');
        try {
          if (!commitment) {
            throw new Error('Commitment not found');
          }
      
          const updatedAmountPaid = (commitment.AmountPaid || 0) + paymentAmount;
          const updatedAmountRemaining = (commitment.CommitmentAmount || 0) - updatedAmountPaid;
          const updatedPaymentsMade = (commitment.PaymentsMade || 0) + 1;
          const updatedPaymentsRemaining = (commitment.PaymentsRemaining || 0) - 1;
      
          if (updatedAmountPaid > commitment.CommitmentAmount) {
            throw new Error("סכום התשלום חורג מסכום ההתחייבות");
          }
          if (updatedAmountRemaining < 0) {
            throw new Error('סכום התשלום גדול מהסכום שנותר לתשלום');
          }
          if (updatedAmountRemaining > commitment.CommitmentAmount) {
            throw new Error('הסכום שנותר לתשלום לא יכול לחרוג מסכום ההתחייבות');
          }
          if (updatedPaymentsMade > commitment.NumberOfPayments) {
            throw new Error('מספר התשלומים בפועל לא יכול לעלות על מספר התשלומים הכולל');
          }
          if (updatedPaymentsRemaining < 0) {
            throw new Error('מספר התשלומים הנותרים לא יכול להיות פחות מאפס');
          }
          if (updatedPaymentsRemaining > commitment.NumberOfPayments) {
            throw new Error('מספר התשלומים שנותרו גדול מסך התשלומיס');
          }
      
          return {
            status: 'success',
          };
        } catch (error) {
          // Rethrow the error to be caught by the outer catch block
          throw error;
        }
      }
      
    
    
      const handlePaymentFileSubmit = async () => {
        fileRef.current.value = null;
    
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
        }).filter(row => row.AnashIdentifier);
        
        let numOfSucces = 0
        let failedData = [];
    
        for (const row of mappedData) {
          // const commitmentId = row.CommitmentId || 'N/A';
          const AnashIdentifier = row.AnashIdentifier || 'N/A';
          const paymentAmount = row.Amount || 0;
          const campainName = row.CampainName || 'N/A';
          let commitmentResponse = null
    
          try {
             
            commitmentResponse = await getCommitmentByAnashAndCampain(AnashIdentifier, campainName);
            row.CommitmentId = commitmentResponse.data?._id;
            console.log(commitmentResponse);
          } 
          catch (error) {
            try{
              const res = await getUserDetails(row.AnashIdentifier)
              failedData.push({
                AnashIdentifier: res.data.data.userDetails?.AnashIdentifier || 'N/A',
                PersonID: res.data.data.userDetails?.PersonID || 'N/A',
                FirstName:res.data.data.userDetails?.FirstName || 'N/A',
                LastName: res.data.data.userDetails?.LastName || 'N/A',
                paymentAmount: paymentAmount || 0,
                status: 'failure',
                reason: "התחייבות לא נמצאה במערכת"
            });
            
    
          }
          catch(error)
          {
              failedData.push({
                status: 'failure',
                reason: "משתמש אינו קיים במערכתת"
            });
    
            }
            finally{
              continue;
            }
    
            
          }
          try {
            const validatePaymentRes = validatePayment(commitmentResponse.data, paymentAmount);
            console.log(validatePaymentRes);
          }
          catch (error) {
            console.error('Error:', error);
            failedData.push({
                AnashIdentifier: commitmentResponse.data?.AnashIdentifier || 'N/A',
                PersonID: commitmentResponse.data?.PersonID || 'N/A',
                FirstName:commitmentResponse.data?.FirstName || 'N/A',
                LastName: commitmentResponse.data?.LastName || 'N/A',
                paymentAmount: paymentAmount || 0,
                status: 'failure',
                reason: error.message
            });
            
            continue;
          }
          
          try {
            const res= await uploadCommitmentPayment(row);      
            if(res.status === 200){
              numOfSucces += 1
              console.log(res);
            }
            
          } catch (error) {
            console.error('Error:', error);
            failedData.push({
                AnashIdentifier: commitmentResponse.data?.AnashIdentifier || 'N/A',
                PersonID: commitmentResponse.data?.PersonID || 'N/A',
                FirstName:commitmentResponse.data?.FirstName || 'N/A',
                LastName: commitmentResponse.data?.LastName || 'N/A',
                paymentAmount: paymentAmount || 0,
                status: 'failure',
                reason: error.response.data.message || error.message
            });
            
          }
        }
        try {
          if(numOfSucces > 0){
          const response = await getCommitment();
          setRowData(response.data.data.commitment || []);
        } 
      }
        catch (error) {
          console.error('Error fetching commitments:', error);
        }
    
        // הצגת המודל עם המידע על ההצלחות והכישלונות
        showFeedbackModal({ success: numOfSucces, failed: failedData,isPayments: true});
      };
    
              
    
      
      
      
      
      
    
    
      const handleFileSubmit = async () => {
        fileRef.current.value = null;
    
        const headers = uploadingData[0];
        const rows = uploadingData.slice(1);
    
        let numberOfSuccess = 0;
        let failedData = [];
    
        // מיפוי הנתונים
        let mappedData = rows.map(row => {
          const mappedRow = {};
          headers.forEach((header, index) => {
            const englishKey = hebrewToEnglishMapping[header];
            if (englishKey) {
              if (row[index] === '' || row[index] == null) {
                // הוספת ערכים ברירת מחדל
                if (englishKey === 'AmountRemaining') {
                  mappedRow[englishKey] = mappedRow['CommitmentAmount'];
                } else if (englishKey === 'AmountPaid') {
                  mappedRow[englishKey] = 0;
                } else if (englishKey === 'PaymentsRemaining') {
                  mappedRow[englishKey] = mappedRow['NumberOfPayments'];
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
              throw new Error('סכום שנותר לתשלומים אפס.');
            }
            if (mappedRow['PaymentsRemaining'] <= 0) {
              throw new Error('מספר התשלומים שנותרו אפס.');
            }
            if (mappedRow['CommitmentAmount'] <= 0) {
              throw new Error('סכום ההתחייבות היא אפס.');
            }
            if (mappedRow['NumberOfPayments'] <= 0) {
              throw new Error('מספר התשלומים הוא אפס.');
            }
            if (mappedRow['CommitmentAmount'] < mappedRow['AmountPaid']) {
              throw new Error('סכום התחייבות לא יכול להיות קטן מסכום ששולם.');
            }
            if (mappedRow['NumberOfPayments'] < mappedRow['PaymentsMade']) {
              throw new Error('מספר התשלומים לא יכול להיות קטן ממספר התשלומים שבוצעו.');
            }
            const isValideAmount = mappedRow['CommitmentAmount'] - mappedRow['AmountPaid'] === mappedRow['AmountRemaining']
            if (!isValideAmount) {
              console.log(mappedRow);
              throw new Error('פרטי סכום התחייבות אינם תקינים.');
            }
            const isValidePayments = mappedRow['NumberOfPayments'] - mappedRow['PaymentsMade'] === mappedRow['PaymentsRemaining']
            if (!isValidePayments) {
              throw new Error('פרטי מספר התשלומים אינם תקינים.');
            }
            return mappedRow;
          } catch (error) {
            failedData.push({ ...mappedRow, reason: error.message });
            return null;
          }
        }).filter(row => row !== null);
        // בדיקת קיום הקמפיינים
        Array.from(new Set(mappedData.map(data => data['CampainName'])));
    
        // בדיקת קיום הקמפיינים
        try {
          const response = await getCampains(); // קבלת כל הקמפיינים מהפונקציה
    
    
          // גישה לשדה שמכיל את המערך
          const campaigns = response.data.data.campains || []; // ניגש ל-campains מתוך הנתונים
    
          if (!Array.isArray(campaigns)) {
            throw new Error('הנתונים מהשרת אינם במבנה של מערך.');
          }
    
          const existingCampaignNames = [...new Set(campaigns.map(campaign => campaign.CampainName))];
    
          const invalidCampaigns = mappedData.filter(data =>data.CampainName && !existingCampaignNames.includes(data['CampainName']));
          const invalidCampaignsNames = invalidCampaigns.map(data => data['CampainName']);
          if (invalidCampaigns.length > 0) {
            failedData.push(...invalidCampaigns.map(data => ({
              ...data,
              reason: 'שם הקמפיין אינו קיים במערכת.',
            })));
          }
          mappedData = mappedData.filter(data => !invalidCampaignsNames.includes(data.CampainName));
          
          //mappedData האם יש מידע ב 
          if (mappedData.length === 0) {
            throw new Error('אין נתונים תקינים בקובץ .');
          }
    
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            showFeedbackModal({ success: numberOfSuccess, failed: failedData, isPayments: false, reason: error.message });
            return;
          }
    
          try {
            
            const response = await uploadCommitment(mappedData);
    
            if (response && response.data) {
              const failedCommitments = response.data.failedCommitments;
    
              const successfulCommitments = response.data.successfulCommitments
              // עיבוד נתוני ההצלחה
              numberOfSuccess = successfulCommitments;
    
              // עיבוד נתוני הכישלון
              failedData.push(...failedCommitments.map(failed => ({
                AnashIdentifier: failed.AnashIdentifier || 'N/A',
                PersonID: failed.PersonID || 'N/A',
                FirstName: failed.FirstName || 'N/A',
                LastName: failed.LastName || 'N/A',
                CommitmentId: failed._id || 'N/A', // If there's no ID, return 'N/A'
                Amount: failed.Amount || 0,
                reason: failed.reason || 'שגיאה לא ידועה'
              })));
              if(numberOfSuccess > 0)
              {
                const res = await getCommitment();
                setRowData(res.data.data.commitment || []);
              }
    
              // הצגת המידע במודל
    
              showFeedbackModal({ success: numberOfSuccess, failed: failedData, isPayments: false });
            } else {
              console.error('Unexpected response structure:', response);
              showFeedbackModal({ success: numberOfSuccess, failed: failedData, isPayments: false, reason: 'תגובה לא תקינה מהשרת' });
            }
          } catch (error) {
            console.error('Error uploading commitments:', error);
            showFeedbackModal({ success: numberOfSuccess, failed: failedData, isPayments: false, reason: 'העלאה נכשלה' });
          }
        } 
      
    
      const handleRowClick = (rowData) => {
        setSelectedRowData(rowData);
      };

    return (
        <div className="commitment-page relative">
            <h1>התחייבויות בקמפיין {campainName}</h1>
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
                <input type="file" onChange={handleFileUpload} ref={fileRef} />
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
                    onClose={handleClosePaymentForm} rowData={rowData} validatePayment={validatePayment} setRowData={setRowData}
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

            <CommitmentTable rowData={rowData} />
        </div>
    );
}

export default CampaignCommitments;
