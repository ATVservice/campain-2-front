import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {getCampains,processCommitmentReport,processCampainReport} from '../requests/ApiRequests.js'
import {englishToHebrewCommitmentReportMapping} from '../components/Utils.js'
import {exportReportCommitmentsToPDF,exportToExcel} from "../../Reports/exportFilesHandler.jsx";
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner.jsx';
import ReportModal from '../components/ReportModal.jsx';
import { set } from 'lodash';


 const englishToHebrewCommitmentFieldsMapping = {
  AnashIdentifier: 'מזהה אנש',
  FirstName: 'שם',
  LastName: 'משפחה',
  PersonID: 'מספר זהות',
  Fundraiser: 'מתרים',
  CommitmentAmount: 'סכום התחייבות',
  AmountPaid: 'סכום שולם',
  AmountRemaining: 'סכום שנותר',
  NumberOfPayments: 'מספר תשלומים',
  PaymentsMade: 'תשלומים שבוצעו',
  PaymentsRemaining: 'תשלומים שנותרו',
  PaymentMethod: 'אופן תשלום',
  Notes: 'הערות',
  ResponseToFundraiser: 'תשובה למתרים',
  CampainName: 'קמפיין',
  ReceivedGift:'קיבל מתנה',
  
};
const englishToHebrewAlfonFieldsMapping = {
  City: 'עיר',
  MobilePhone: 'טל נייד',
  MobileHomePhone: 'נייד בבית 1',
  HomePhone: 'טל בית',
  
};

const sortPageOptions = {
  BeitMidrash: 'בית מדרש',
  Classification: 'סיווג',
  DonationMethod: 'אופן התרמה',
  Fundraiser: 'מתרים',
  City: 'עיר',
  CampainName: 'קמפיין',
  StudiedInYeshivaYears: 'למד בישיבה בשנים',
  yashagYear: 'שנה יש"ג',
  CommitteeResponsibility: 'אחראי ועד',
  PartyGroup: 'קבוצה למסיבה',
  GroupNumber: 'מספר קבוצה',
  PartyInviterName: 'שם מזמין למסיבה',
  FreeFieldsToFillAlone: 'שדה חופשי',
  AnotherFreeFieldToFillAlone: 'שדה חופשי 2',
  Notes: 'הערות',

  
}



function ReportCommitments() {
  const [campains, setCampains] = useState([]);
  const [reportData, setReportData] = useState({selectedCampains:[],campainsToCompare:[],selectedFields: {commitmentFields: [],alfonFields: []},groupByField: '',sortByField: ''});
  const [fieldsOptions, setFieldsOptions] = useState({
    ...englishToHebrewCommitmentFieldsMapping,
    ...englishToHebrewAlfonFieldsMapping,
  });
    const [selectedFields, setSelectedFields] = useState([]);
    const [selectedSortPageOption, setSelectedSortPageOption] = useState('');
    const {campainName} = useParams();
    const [isPdfState, setIsPdfState] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportResult, setReportResult] = useState([]);
    const [dinamicColums, setDinamicColums] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    

  useEffect(() => {

    const fetchCampains = async () => {
      if(campainName) {
        setReportData((prevData) => ( {...prevData, selectedCampains: [campainName]}));
      }
      try {
        setIsLoading(true);
        const response = await getCampains();
        console.log(response.data); // 
        setCampains(response.data.data.campains);
      } catch (error) {
        console.error('שגיאה בטעינת הקמפיינים', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchCampains(); 
      
  
    
  }, []);

  const handleSelectCampains = (event) => {
    const isSelected = event.target.checked;
    const value = event.target.value;
  
    setReportData((prevData) => {
      // const updatedCampainsToCompare = isSelected && prevData.campainsToCompare.includes(value)
      //   ? prevData.campainsToCompare.filter((campain) => campain !== value)
      //   : prevData.campainsToCompare;
      const updatedSelectedCampains = isSelected ? [...prevData.selectedCampains, value] : prevData.selectedCampains.filter((campain) => campain !== value);
  
      return {
        ...prevData,
        selectedCampains: updatedSelectedCampains,
      };
    });
  };
  const handleSelectCampainsToCompare = (event) => {
    const isSelected = event.target.checked;
    const value = event.target.value;
  
    setReportData((prevData) => {
      let updatedCampainsToCompare;
      let updatedSelectedCampain = prevData.selectedCampains;
  
      if (!isSelected) {
        // Remove the campaign from campainsToCompare
        updatedCampainsToCompare = prevData.campainsToCompare.filter((campain) => campain !== value);
  
        // If the deselected campaign is the selected one, unsele
      } else {
        // Add the campaign to campainsToCompare, maintaining the max of 3
        updatedCampainsToCompare = [...prevData.campainsToCompare, value];
        if (updatedCampainsToCompare.length > 3) {
          updatedCampainsToCompare = updatedCampainsToCompare.slice(1); // Keep the last 3
        }
  
        
      }
  
      return {
        ...prevData,
        campainsToCompare: updatedCampainsToCompare,
      };
    });
  };
      

  const handleSelectField = (event) => {
    const value = event.target.value;
    const isSelected = event.target.checked;
    if (isSelected) {
      setSelectedFields([...selectedFields, value]);
    } else {
      setSelectedFields(selectedFields.filter((field) => field !== value));
    }
  };
  const handleGroupByField = (event) => {
    const checked = event.target.checked;
    const value = event.target.value;
    setReportData((prevData) => ({
      ...prevData,
      groupByField: checked ? value : '',

    }));

  };

  const handleSortByField = (event) => {
    const checked = event.target.checked;
    const value = event.target.value;
    console.log(checked);
  
    if (checked && !selectedFields.includes(value)) {
      toast.error('לא ניתן למיין לפי שדה שלא באחד משדות הבחירה');
  
      // Ensure the checkbox is unchecked
      return;
    }
  
    setReportData((prevData) => ({
      ...prevData,
      sortByField: checked ? value : '',
    }));
  };
    



  const handleSubmit = async () => {
    if(reportData.sortByField && !selectedFields.includes(reportData.sortByField)) {
      toast.error('לא ניתן למיין לפי שדה שלא באחד משדות הבחירה');
      return
    }

    const commitmentfieldsKeys = Object.keys(englishToHebrewCommitmentFieldsMapping);
    const alfonFieldsKeys = Object.keys(englishToHebrewAlfonFieldsMapping);
  
    // Create the updated report data in a local variable
    let updatedReportData = { ...reportData };
    // console.log(selectedFields);
    // return
  
    for (let i = 0; i < selectedFields.length; i++) {
      if (commitmentfieldsKeys.includes(selectedFields[i])) {
        updatedReportData = {
          ...updatedReportData,
          selectedFields: {
            ...updatedReportData.selectedFields,
            commitmentFields: [
              ...updatedReportData.selectedFields.commitmentFields,
              selectedFields[i],
            ],
          },
        };
      } else if (alfonFieldsKeys.includes(selectedFields[i])) {
        updatedReportData = {
          ...updatedReportData,
          selectedFields: {
            ...updatedReportData.selectedFields,
            alfonFields: [
              ...updatedReportData.selectedFields.alfonFields,
              selectedFields[i],
            ],
          },
        };
      }
    }
    const functionToExcute = campainName ? processCampainReport : processCommitmentReport;
// console.log(updatedReportData);
    try
    {
      setIsLoading(true);
      const response = await functionToExcute(updatedReportData);
      // console.log(response);
      const reportData = response.data.reportData;
    if(isPdfState)
    {

      exportReportCommitmentsToPDF(reportData,englishToHebrewCommitmentReportMapping,'commitmentsReport.pdf',updatedReportData.groupByField);
    }
    else
    {
      const flatData = Object.values(reportData).flat();
      let dynamicColumns = Array.from(
        new Set(
          flatData.flatMap((item) => Object.keys(item))
        )
    );
    setDinamicColums(dynamicColumns);
    setReportResult(flatData);
    setShowReportModal(true);
  }

    
    

      

   
  }
  catch (error) {
    console.error('שגיאה בטעינת הדו"ח', error);
    toast.error(error.response.data.message || 'שגיאה בטעינת הדו"ח');
  }
  finally {
    setIsLoading(false);
  }
  };
const onCloseModal = () => {
  setShowReportModal(false);
  setReportResult([]);
}
const handleSubmitExcel = async () => {
  const reportName = campainName ? 'דו"ח קמפיין' : 'דו"ח התחייבויות';
  exportToExcel(reportResult,dinamicColums,fieldsOptions, reportName);
  
  
}

  

  if(isLoading) {
    return <Spinner />;
  }
  


  
  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-2">
<section className='flex justify-between'>
  <section>
    {!campainName && (
              <>
                <h1 className="text-xl font-bold mb-6">יצירת דו״ח התחייבויות</h1>
                <section className="flex gap-10">
                  <div className="mb-6 bg-indigo-100 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3">בחר קמפיינים</h2>
                    <div className="grid grid-cols-3 gap-3">
                      {campains.map((campain) => (
                        <label key={campain._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={reportData.selectedCampains.includes(campain.CampainName)}
                            onChange={handleSelectCampains}
                            value={campain.CampainName}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{campain.CampainName}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
            {campainName && (
              <>
                <h1 className="text-xl font-bold mb-6 bg-indigo-100 rounded-lg p-4">יצירת דו״ח קמפיין {campainName}</h1>
              </>
            )}
  </section>
  
  <section >
    <div className='flex gap-4 border border-gray-300 rounded-lg p-2 items-start'>
      <label className="flex gap-2 font-bold items-center m-0">
        <input
          type="radio"
          name="reportFormat"
          value="pdf"
          onChange={() => setIsPdfState(true)}
          checked={isPdfState}
          className="accent-red-600"
        />
        <span className="text-red-500">PDF</span>
      </label>
      <label className="flex gap-2 font-bold items-center m-0">
        <input
          type="radio"
          name="reportFormat"
          value="excel"
          onChange={() => setIsPdfState(false)}
          checked={!isPdfState}
          className="accent-blue-600"
        />
        <span className="text-blue-500">Excel</span>
      </label>
    </div>
</section>
</section>

         
  
      <div className="mb-6 bg-indigo-100 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3"> קמפיינים סכומי התחייבות</h2>
        <div className="grid grid-cols-3 gap-3">
          {campains.map((campain) => (
            <label key={campain._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reportData.campainsToCompare.includes(campain.CampainName)}
                onChange={handleSelectCampainsToCompare}
                value={campain.CampainName}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{campain.CampainName}</span>
            </label>
          ))}
        </div>
      </div>
  
      {/* Field Selection */}
      <section className="flex gap-10">
        <div className="mb-6 bg-indigo-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">בחירת שדות</h2>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(fieldsOptions).map(([field, label]) => (
              <label key={field} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field)}
                  onChange={handleSelectField}
                  value={field}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
  
        
{   
isPdfState  &&

<div className="mb-6 bg-indigo-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-3">חלוקת דפים לפי</h2>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(sortPageOptions).map(([field, label]) => (
          <label key={field} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reportData.groupByField === field}
              onChange={handleGroupByField}
              value={field}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>
}  

{/* Sort Selection */}
<div className="mb-6 bg-indigo-50 rounded-lg p-4">
  <h2 className="text-lg font-semibold mb-3">מיון לפי</h2>
  <div className="grid grid-cols-3 gap-3">
    {Object.entries(fieldsOptions).map(([field, label]) => (
      <label key={field} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={reportData.sortByField === field}
          onChange={handleSortByField}
          value={field}
          className="rounded border-gray-300"
        />
        <span className="text-sm">{label}</span>
      </label>
    ))}
  </div>
</div>
      </section>
  
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          הוצא דו"ח
        </button>
      </div>
      {     
showReportModal &&
 <ReportModal reportResult={reportResult} columns={dinamicColums} columnsMappingToHebrew={fieldsOptions} onClose={onCloseModal}  onSubmit={handleSubmitExcel}/>
}

    </div>
  );
  
  
  }

export default ReportCommitments