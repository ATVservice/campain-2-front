import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {reviewCommitments,uploadCommitments,getCommitmentsByCampaign} from  '../requests/ApiRequests'
// import CommitmentTable from "../components/CommitmentTable";
import ReviewCommitmentsModal from "../components/ReviewCommitmentsModal";
import CommitmentForm from "../components/CommitmentForm";
import Payments from "../components/Payments";
import CommitmentTable from "../components/CommitmentTable";
import Spinner from "../components/Spinner";


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
  };
  let { campainName } = useParams(); // Extracts the 'campainName' from the URL
  campainName = campainName && campainName != "undefined" ? campainName : null

  const [commitments, setCommitments] = useState([]);
  const [validCommitments, setValidCommitments] = useState([]);
  const [invalidCommitments, setInvalidCommitments] = useState([]);
  const [showCommitmentForm, setShowCommitmentForm] = useState(false);
  const [showCommitmentsOfAcivePeople, setShowCommitmentsOfAcivePeople] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fileRef = useRef(null);

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // Filter out rows with empty values
      json = json.filter((row) =>
        row.some((cell) => cell !== null && cell !== undefined && cell !== "")
      );
  
      // Clear file input
      fileRef.current.value = null;
  
      // Check for valid data
      if (!json || json.length === 0 || json.length === 1) {
        toast.error("אין נתונים בקובץ");
        return;
      }
  
      const headers = json[0];
      const rows = json.slice(1);
  
      // Map the data to English keys
      const mappedDataToEnglish = rows.map((row) => {
        const mappedRow = {};
        headers.forEach((header, index) => {
          const englishKey = hebrewToEnglishMapping[header];
          if (englishKey) {
            mappedRow[englishKey] = row[index];
          }
        });
        if(campainName && !mappedRow["CampainName"])
        {
          mappedRow["CampainName"] = campainName
        }
        return mappedRow;
      });
          

      onReviewCommitments(mappedDataToEnglish);
  
     
    };
  
    reader.readAsArrayBuffer(file);

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
    


if(isLoading)
  return <Spinner />


    return (
    <div className="p-2">
  <div className="flex items-center mb-4">
  <input
    type="file"
    id="commitmentFile"
    name="file"
    onChange={handleFileUpload}
    ref={fileRef}
    className="hidden"
    />
  <button
    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-4"
    onClick={() => fileRef.current && fileRef.current.click()}
    >
    בחר קובץ התחייבויות
  </button>
    <button 
      className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded ml-10"
      onClick={() => setShowCommitmentForm(true)}
    >
     מלא טופס התחייבות
    </button>
    <Payments />
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
  {commitments?.length > 0 &&<CommitmentTable rowsData={[...commitments]} setShowCommitmentsOfActivePeople={setShowCommitmentsOfAcivePeople} showCommitmentsOfActivePeople={showCommitmentsOfAcivePeople}/>}

    </div>
  );
}

export default CommitmentPage2;
