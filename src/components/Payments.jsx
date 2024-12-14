import { useNavigate ,useParams} from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reviewCommitmentsPayments,uploadCommitmentsPayments,uploadCommitmentPayment } from "../requests/ApiRequests";
import ReviewPaymentsModal from "./ReviewPaymentsModal";
import PaymentForm from "./PaymentForm";
import Spinner from "./Spinner";
import { readFileContent } from "./Utils";
import {englishToHebrewPaymentsMapping,hebrewToEnglishPaymentsMapping} from './Utils'



function Payments() {
  const hebrewToEnglishMapping = {
    "הערות": "AnashIdentifier",
    'מזהה אנש': "AnashIdentifier",
    "מספר זהות": "PersonID",
    'שם': "FirstName",
    'משפחה': "LastName",
    "סכום התחייבות": "CommitmentAmount",
    "סכום שולם": "AmountPaid",
    "סכום שנותר": "AmountRemaining",
    "מספר תשלומים": "NumberOfPayments",
    "תשלומים שבוצעו": "PaymentsMade",
    "תשלומים שנותרו": "PaymentsRemaining",
    'מתרים': "Fundraiser",
    "מותג": "PaymentMethod",
    "תנועה": "PaymentMethod",
    "אופן תשלום": "PaymentMethod",
    "תשובה למתרים": "ResponseToFundraiser",
    "יום הנצחה": "MemorialDay",
    'הנצחה': "Commemoration",
    "מספר התחייבות": "CommitmentId",
    'סכום': "Amount",
    'תאריך עסקה': "Date",
    'תאריך': "Date",
    'קמפיין': "CampainName",
    'קטגוריה': "CampainName",
    'קטגורייה': "CampainName",
  };
    

  const fileRef = useRef(null);
  const [validPaymentsWithCommitment, setValidPaymentsWithCommitment] = useState([]);
  const [validPaymentsWithoutCommitment, setValidPaymentsWithoutCommitment] = useState([]);
  const [invalidPayments, setInvalidPayments] = useState([]);
  const [showPaymentsForm, setShowPaymentsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { campainName } = useParams();

  function parseExcelDate(value) {
    // Check if value is a number, which Excel often uses for dates
    const dateObject = XLSX.SSF.parse_date_code(value);
    return new Date(dateObject.y, dateObject.m - 1, dateObject.d);
  }
  function getPaymentMethod(hebrewHeader,cellValue) {
    if(!cellValue)
      return null
    if(cellValue === 'החזרת הוראת קבע')
    {
      return 'החזר תשלום'
    }
    else if(hebrewHeader === 'מותג')
    {
      return 'אשראי הו"ק'
    }
    else if(hebrewHeader === 'תנועה' && cellValue === 'שידור')
    {
      return 'הוראת קבע'
    }
    else if(hebrewHeader === 'אופן תשלום')
    {
      return  cellValue
    }
    else
    {
      return null
    }
      
    
    
  }
   const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast.error("Unsupported file type");
      return;
    }
    if (fileExtension == 'csv')
      {
        toast.error("סוג קובץ לא נתמך יש להעלות קובץ עם סיומת  xlsx",{rtl:true});
        return;
      }
    let rows = []
    try {
            // Get the rows from the file using the utility function
         rows = await readFileContent(file, fileExtension); // Pass fileExtension to the utility function

        // Check for valid data
        if (!rows || rows.length === 0 || rows.length === 1) {
          toast.error("אין נתונים בקובץ");
          return;
        }
      
    }
    catch (error) {
      console.log(error);
      toast.error(error.response.data?.message);
      return;
    }
// console.log(rows);
      fileRef.current.value = null;

      const headers = rows[0];
      rows = rows.slice(1);

      const mappedDataToEnglish = rows.map((row) => {
        const mappedRow = {};
        headers.forEach((header, index) => {
          const englishKey = hebrewToEnglishMapping[header];
          if (englishKey) {
            if (englishKey == "Date") {
              mappedRow[englishKey] = parseExcelDate(row[index]);
              // console.log(mappedRow[englishKey]);

            }
            else if (englishKey === "PaymentMethod") 
              {

                mappedRow[englishKey] = getPaymentMethod(header,row[index]);
            }
             else {
              mappedRow[englishKey] = row[index];
            }
          }
        });
        return mappedRow;
      });
      console.log(mappedDataToEnglish);
      onReviewPayments(mappedDataToEnglish);
    
  };
  async function onReviewPayments(payments) {
    console.log('e');
    try {
      // Send the mapped data to reviewCommitments
      setIsLoading(true);
      const response = await reviewCommitmentsPayments(payments,campainName);
      setValidPaymentsWithCommitment(response.data.validPaymentsWithCommitment);
      setValidPaymentsWithoutCommitment(response.data.validPaymentsWithoutCommitment);
      setInvalidPayments(response.data.invalidPayments);
      console.log(response);
     
      // Optionally store the uploaded data
    } catch (error) {
      console.error("Error during reviewCommitments:", error);
    }
    finally
    {
      setIsLoading(false);
    }
  }

  async function onUploadPayments() {
    // console.log('222');
    const paymentsToUpload = [...validPaymentsWithCommitment, ...validPaymentsWithoutCommitment];
    setInvalidPayments([]);
    setValidPaymentsWithCommitment([]);
    setValidPaymentsWithoutCommitment([]);

    if (paymentsToUpload?.length == 0) {
      toast.error("אין נתונים לשליחה");
      return;
    } else {
        try
        {
          setIsLoading(true);
          const response = await uploadCommitmentsPayments(paymentsToUpload);
          
          console.log(response);
          toast.success("תשלום/ים נוספו בהצלחה");
          return response;
        }
        catch(error)
        {
          console.log(error);
          toast.error(error.response.data.message);
        }
        finally
        {
          setIsLoading(false);
        }
    }
  }
  async function onUploadPaymentManually(payment) {

  
        try
        {
          setIsLoading(true);
          const response = await uploadCommitmentPayment(payment);
          console.log(response);
          toast.success("תשלום נוסף בהצלחה");
          return response;
        }
        catch(error)
        {
          console.log(error);
          toast.error(error.response.data.message);
        }
        finally
        {
          setIsLoading(false);
        }
    
  }
  if(isLoading)
  {
    return <Spinner/>
  }

  return (
    <>
      <div className="flex items-center">
        <input
          type="file"
          id="paymentsFile"
          name="file"
          onChange={handleFileUpload}
          ref={fileRef}
          className="hidden"
        />
        <div className="flex gap-4">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded "
            onClick={() => fileRef.current && fileRef.current.click()}
          >
            בחר קובץ תשלומים
          </button>
          <button
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded "
            onClick={() => setShowPaymentsForm(true)}
          >
             מלא טופס תשלום
          </button>
        </div>
        
      </div>
      {(validPaymentsWithCommitment?.length > 0|| validPaymentsWithoutCommitment?.length > 0 || invalidPayments?.length > 0) && (
        <ReviewPaymentsModal
          onUploadPayments={onUploadPayments}
          validPaymentsWithCommitment={validPaymentsWithCommitment}
          validPaymentsWithoutCommitment={validPaymentsWithoutCommitment}
          invalidPayments={invalidPayments}
          onClose={() => {
            setValidPaymentsWithCommitment([]);
            setValidPaymentsWithoutCommitment([]);
            setInvalidPayments([]);
          }}
        />
      )}

      {showPaymentsForm && (
        <PaymentForm
          onSubmit={ onUploadPaymentManually}
          onClose={() => setShowPaymentsForm(false)}
          campainName={campainName}
        />
      )}
    </>
  );
}

export default Payments;
