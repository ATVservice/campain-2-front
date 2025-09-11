import React, { useEffect, useRef, useMemo, useState } from 'react'
import { getCampains, campainPaymentsReport, dateRangePaymentsReport } from '../requests/ApiRequests.js'
import { englishToHebrewPaymentsReportMapping } from '../components/Utils.js'
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { exportReportpaymentsToPDF, exportToExcel } from "../../Reports/exportFilesHandler.jsx";
import ReportModal from '../components/ReportModal.jsx';
import Spinner from '../components/Spinner.jsx';



const englishToHebrewPaymentsFieldsMapping = {
  AnashIdentifier: 'מזהה אנש',
  Amount: 'סכום',
  Date: 'תאריך',
  PaymentMethod: 'אופן תשלום',
  CampainName: 'קמפיין',

};


const englishToHebrewAlfonFieldsMapping = {
  City: 'עיר',
  MobilePhone: 'טל נייד',
  MobileHomePhone: 'נייד בבית 1',
  HomePhone: 'טל בית',
  LastName: 'משפחה',
  FirstName: 'שם',

};





function ReportPayments() {

  const [campains, setCampains] = useState([]);
  const [reportData, setReportData] = useState({ dateRange: { startDate: '', endDate: '' }, selectedCampain: '', selectedFields: { paymentsFields: [], alfonFields: [] }, groupByField: '', sortByField: '' });
  const [reportResult, setReportResult] = useState([]);
  const [fieldsOptions, setFieldsOptions] = useState({
    ...englishToHebrewPaymentsFieldsMapping,
    ...englishToHebrewAlfonFieldsMapping,
  });
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const [isPdfState, setIsPdfState] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allFieldKeys = useMemo(() => Object.keys(fieldsOptions), [fieldsOptions]);
  const selectAllRef = useRef(null);

  useEffect(() => {
    const fetchCampains = async () => {
      if (filter !== 'campainName') return
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

      return {
        ...prevData,
        selectedCampain: isSelected ? value : '',
      };
    });
  };

  const handleSelectField = (e) => {
    const { value, checked } = e.target;
    setSelectedFields(prev =>
      checked ? [...prev, value] : prev.filter(f => f !== value)
    );
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

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      dateRange: {
        ...prevData.dateRange,
        [name]: value,
      },
    }));
  }

  const handleToggleSelectAll = () => {
    const selectingAll = selectedFields.length !== allFieldKeys.length;
    if (selectingAll) {
      setSelectedFields(allFieldKeys);
    } else {
      setSelectedFields([]);
      setReportData((prev) => ({ ...prev, sortByField: '' }));
    }
  };

  useEffect(() => {
    if (!selectAllRef.current) return;
    const total = allFieldKeys.length;
    const selected = selectedFields.length;
    selectAllRef.current.indeterminate = selected > 0 && selected < total;
  }, [selectedFields, allFieldKeys]);

  const handleSubmit = async () => {
    if (reportData.sortByField && !selectedFields.includes(reportData.sortByField)) {
      toast.error('לא ניתן למיין לפי שדה שלא באחד משדות הבחירה');
      return
    }

    const PaymentsReportKeys = Object.keys(englishToHebrewPaymentsFieldsMapping);
    const alfonFieldsKeys = Object.keys(englishToHebrewAlfonFieldsMapping);

    // Create the updated report data in a local variable
    let updatedReportData = { ...reportData };
    // console.log(selectedFields);
    // return

    for (let i = 0; i < selectedFields.length; i++) {
      if (PaymentsReportKeys.includes(selectedFields[i])) {
        updatedReportData = {
          ...updatedReportData,
          selectedFields: {
            ...updatedReportData.selectedFields,
            paymentsFields: [
              ...updatedReportData.selectedFields.paymentsFields,
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

    const functionToExcute = filter === 'campainName' ? campainPaymentsReport : dateRangePaymentsReport;
    try {
      setIsLoading(true);
      const response = await functionToExcute(updatedReportData);
      console.log(response);
      const reportData = response.data.reportData;
      if (isPdfState)
        exportReportpaymentsToPDF(reportData, englishToHebrewPaymentsReportMapping, 'paymentsReport.pdf');
      else {
        setReportResult(reportData);
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

    exportToExcel(reportResult, selectedFields, fieldsOptions, 'דו"ח תשלומים');


  }







  if (isLoading) {
    return <Spinner />;
  }





  return (

    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg mt-2">
      <div className='flex justify-between'>
        <h1 className="text-xl font-bold">יצירת דו״ח תשלומים</h1>

        <section className='flex items-start gap-4 border border-gray-300 rounded-lg p-2'>
          <label className="flex gap-2 font-bold items-center">
            <input
              type="radio"
              name="reportFormat"
              value="pdf"
              onChange={() => setIsPdfState(true)}
              checked={isPdfState}
              className="accent-red-600"
            />
            <span className='text-red-500' >PDF</span>
          </label>
          <label className=" flex gap-2 font-bold items-center">
            <input
              type="radio"
              name="reportFormat"
              value="excel"
              onChange={() => setIsPdfState(false)}
              checked={!isPdfState}
              className="accent-blue-600"
            />
            <span className='text-blue-500'>Excel</span>
          </label>

        </section>
      </div>
      {
        filter === 'campainName' &&
        <section className="flex gap-10">
          <div className="mb-6 bg-indigo-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">בחר קמפיין</h2>
            <div className="grid grid-cols-3 gap-3">
              {campains.map((campain) => (
                <label key={campain._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reportData.selectedCampain === campain.CampainName}
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

      }

      {
        filter === 'dateRange' &&
        <section className="flex gap-10">
          <div className="mb-6 bg-indigo-100 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">בחר טווח תאריכים</h2>
            <div className="flex gap-3">
              <div className="flex flex-col">
                <label className="mb-1" htmlFor="startDate"> תאריך התחלה: </label>
                <input
                  className="rounded w-full"
                  type="date"
                  name="startDate"
                  value={reportData.dateRange.startDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1" htmlFor="endDate"> תאריך סיום: </label>
                <input
                  className="rounded w-full"
                  type="date"
                  name="endDate"
                  value={reportData.dateRange.endDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>
          </div>
        </section>
      }


      <section className="flex gap-10">
        <div className="mb-6 bg-indigo-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">בחירת שדות</h2>
          <label className="flex items-center gap-2 mb-3 font-medium">
            <input
              type="checkbox"
              ref={selectAllRef}
              onChange={handleToggleSelectAll}
              checked={selectedFields.length === allFieldKeys.length && allFieldKeys.length > 0}
              className="rounded border-gray-300"
            />
            <span className="text-sm">בחר הכל</span>
          </label>
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
        <ReportModal reportResult={reportResult} columns={selectedFields} columnsMappingToHebrew={fieldsOptions} onClose={onCloseModal} onSubmit={handleSubmitExcel} />
      }






    </div>
  )
}

export default ReportPayments