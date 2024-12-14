import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {reviewCommitments,uploadCommitments,getCommitmentsByCampaign} from  '../requests/ApiRequests'
// import CommitmentTable from "../components/CommitmentTable";
import ReviewCommitmentsModal from "../components/ReviewCommitmentsModal";
import CommitmentForm from "../components/CommitmentForm";
import Payments from "../components/Payments";
import CommitmentTable from "../components/CommitmentTable";
import Spinner from "../components/Spinner";
import { readFileContent } from "../components/Utils";
import { exportToExcel, exportToPDF } from "../../Reports/exportFilesHandler";
import {englishToHebrewCommitmentMapping,hebrewToEnglishCommitmentMapping} from '../components/Utils'



function CommitmentPage2() {
  const hebrewToEnglishMapping = {
    "מזהה אנש": "AnashIdentifier",
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
    "אופן תשלום": "PaymentMethod",
    'הערות': "Notes",
    "תשובה למתרים": "ResponseToFundraiser",
    "יום הנצחה": "MemorialDay",
    'הנצחה': "Commemoration",
    "מספר התחייבות": "CommitmentId",
    'סכום': "Amount",
    'תאריך': "Date",
    'קמפיין': "CampainName",
    'קטגוריה': "CampainName",
    'קטגורייה': "CampainName",

  };
  let { campainName } = useParams(); // Extracts the 'campainName' from the URL
  campainName = campainName && campainName != "undefined" ? campainName : null

  const [commitments, setCommitments] = useState([]);
  const [validCommitments, setValidCommitments] = useState([]);
  const [invalidCommitments, setInvalidCommitments] = useState([]);
  const [showCommitmentForm, setShowCommitmentForm] = useState(false);
  const [showCommitmentsOfAcivePeople, setShowCommitmentsOfAcivePeople] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dataToExportToExcel, setDataToExportToExcel] = useState([]);
  const gridRef = useRef(null);
  const navigate = useNavigate();



  const fileRef = useRef(null);

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    
    // Check for file type before calling the utility function
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast.error("Unsupported file type. Please upload an Excel or CSV file.");
      return;
    }
    if (fileExtension == 'csv')
      {
        toast.error("סוג קובץ לא נתמך יש להעלות קובץ עם סיומת  xlsx",{rtl:true});
        return;
      }
  
  
    try {
      // Get the rows from the file using the utility function
      const rows = await readFileContent(file, fileExtension); // Pass fileExtension to the utility function
  
      // Check for valid data
      if (!rows || rows.length === 0 || rows.length === 1) {
        toast.error("אין נתונים בקובץ");
        return;
      }
  
      // Extract headers and data rows
      const headers = rows[0];
      const dataRows = rows.slice(1);
  
      // Map the data to English keys
      const mappedDataToEnglish = dataRows.map((row) => {
        const mappedRow = {};
        headers.forEach((header, index) => {
          const englishKey = hebrewToEnglishMapping[header];
          if (englishKey) {
            mappedRow[englishKey] = row[index];
          }
        });
        if (campainName && !mappedRow["CampainName"]) {
          mappedRow["CampainName"] = campainName;
        }
        return mappedRow;
      });
  
      console.log(mappedDataToEnglish);
      
      // Call onReviewCommitments with the mapped data
      onReviewCommitments(mappedDataToEnglish);
  
      // Clear file input
      fileRef.current.value = null;
  
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("There was an error processing the file.");
    }
  }
  async function onReviewCommitments(commitments)
  {
    try {
      setIsLoading(true);
      // Send the mapped data to reviewCommitments
     const response = await reviewCommitments(commitments,campainName);
     setValidCommitments(response.data.validCommitments);
     setInvalidCommitments(response.data.invalidCommitments);
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

  async function onUploadCommitments()
  {
    const commitmentsToUpload = [...validCommitments];
    setInvalidCommitments([]);
    setValidCommitments([]);

    if(commitmentsToUpload?.length == 0)
    {
      toast.error("אין נתונים לשליחה");
      return;
    }
    else
    {
      try
      {
        setIsLoading(true);
        const response = await uploadCommitments(commitmentsToUpload);
        console.log(response);
        // setCommitments([...commitments, ...response.data.uploadedCommitments]);
        toast.success("התחייבויות נוספו בהצלחה");
       
      }
      catch(error)
      {
        setIsLoading(false);
        console.log(error);
        toast.error("שגיאה בשליחת התחייבויות");
        return;
      }
      try
      {
        setIsLoading(true);
        const response = await getCommitmentsByCampaign(campainName, showCommitmentsOfAcivePeople);
        console.log(response);
        setCommitments(response.data.commitments);
      }
      catch(error)
      {
        console.log(error);
      }
      finally
      {
        setIsLoading(false);
      }



    }
  }

  useEffect(() => {
    console.log(campainName);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getCommitmentsByCampaign(campainName, showCommitmentsOfAcivePeople);
        console.log(response);
        setCommitments(response.data.commitments);
      } catch (error) {
        console.error('Error fetching commitments:', error);
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showCommitmentsOfAcivePeople]);



  const onGetDataToExportToExcel = (data) => {

    setDataToExportToExcel(data);
  }

  const getCurrentGridData = () => {
    if(!gridRef.current || !gridRef.current.api) return 

    const columnOrder = gridRef.current.api
      .getColumnDefs()
      .map((colDef) => colDef.field);
    const rowData = [];

    gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
      const reorderedData = new Map();
      columnOrder.forEach((field) => {
        if (field in node.data) {
          reorderedData.set(field, node.data[field]);
        }
      });

      // Convert Map back to an object with ordered keys
      rowData.push(Object.fromEntries(reorderedData));
    });

    return rowData;
  };



  const handelExportToExcel = () => {

    const data = getCurrentGridData();
    exportToExcel(data,englishToHebrewCommitmentMapping, 'התחייבויות');
  }
    
  const handelExportToPdf = () => {
    const data = getCurrentGridData();
    exportToPDF(data,englishToHebrewCommitmentMapping, 'התחייבויות');
  }


    


if(isLoading)
  return <Spinner />


    return (
    <div className="w-screen max-w-full	">
  <div className="flex items-center mb-4 p-2 gap-10">
  <input
    type="file"
    id="commitmentFile"
    name="file"
    onChange={handleFileUpload}
    ref={fileRef}
    className="hidden"
    />
  <div className="flex gap-4">
    <button
      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => fileRef.current && fileRef.current.click()}
      >
      בחר קובץ התחייבויות
    </button>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded "
        onClick={() => setShowCommitmentForm(true)}
      >
       מלא טופס התחייבות
      </button>
  </div>
    <Payments />
    <div className="flex gap-4">
      <button type='button' className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded  '
        onClick={() => handelExportToPdf()}
        >
        יצוא דו"ח PDF
      </button>
      <button type='button' className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded '
        onClick={() => handelExportToExcel()}
        >
        יצוא דו"ח EXCEL
      </button>
     
    </div>
      <button type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-auto'
        onClick={() => navigate('/payments-without-commitment')}
        >
          
        תשלומים ללא התחייבות
      </button>
          
    

  </div>



  {/* Display selected file name if needed */}
  {fileRef.current?.files[0] && (
    <span className="ml-2">{fileRef.current.files[0].name}</span>
  )}
    {(validCommitments?.length > 0 || invalidCommitments?.length > 0) && (
  <ReviewCommitmentsModal 
    onUploadCommitment={onUploadCommitments}
    validCommitments={validCommitments} 
    invalidCommitments={invalidCommitments} 
    onClose={() => {
      setValidCommitments([]);
      setInvalidCommitments([]); // Assuming you have setInvalidCommitments
    }}
  />
)}

      {showCommitmentForm && (
        <CommitmentForm
        onSubmit={onReviewCommitments}
        onClose={() => setShowCommitmentForm(false)}
        />
      )}
  {<CommitmentTable rowsData={[...commitments]} setShowCommitmentsOfActivePeople={setShowCommitmentsOfAcivePeople} 
  showCommitmentsOfActivePeople={showCommitmentsOfAcivePeople} gridRef={gridRef}/>}

    </div>
  );
}

export default CommitmentPage2;
