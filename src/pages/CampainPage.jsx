import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getCampainPeople, getCommitmentInCampain ,getCampainByName,getCampainIncomSummeryByPaymentMethod} from '../requests/ApiRequests';
import Spinner from '../components/Spinner';
function CampainPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const campainName = queryParams.get('campainName');
  const minimumAmountForMemorialDay = queryParams.get('minimumAmountForMemorialDay');
  const [incomsByPaymentsMethods, setIncomsByPaymentsMethods] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { campainId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    peopleInCampain: 0,
    peopleWithCommitments: 0,
    totalCommitted: 0,
    totalPaid: 0,
  });

  const [runningNumbers, setRunningNumbers] = useState({
    peopleInCampain: 0,
    peopleWithCommitments: 0,
    totalCommitted: 0,
    totalPaid: 0,
  });
  const [campainHebrewDatesRange, setCampainHebrewDatesRange] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchStats = async () => {
    try {
      console.log("Fetching campaign stats...");

      setIsLoading(true);
      const response = await getCampainPeople(campainName);
      const response2 = await getCommitmentInCampain(campainName);
      const campainRes = await getCampainByName(campainName);
      const incomsByPaymentsMethodsRes = await getCampainIncomSummeryByPaymentMethod(campainName);
      setIncomsByPaymentsMethods(incomsByPaymentsMethodsRes.data.incomsByPaymentsMethods)
      
      console.log(campainRes);
      console.log("Responses received", response, response2);

      const peopleData = response.data; // קבלת מערך האנשים
      const commitmentData = response2.data.data; // קבלת הנתונים מההתחייבויות

      const peopleInCampain = peopleData.length;
      setStats({
        peopleInCampain,
        peopleWithCommitments: commitmentData.numberOfCommitments, // שימוש במספר ההתחייבויות
        totalCommitted: commitmentData.totalCommitted,
        totalPaid: commitmentData.totalPaid,
      });
      const campain = campainRes.data.data.campain;
      setCampainHebrewDatesRange({
        startDate: campain.
        hebrewStartDate,
        endDate: campain.hebrewEndDate
      })
        
      


    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    }
    finally {
      console.log("Setting isLoading to false");

      setIsLoading(false);
    }
  };


  // שימוש ב-useEffect להפעלת הפונקציה fetchStats בעת טעינת הדף
  useEffect(() => {
    fetchStats(); // קריאה לפונקציה המעדכנת את הנתונים
  }, []);



  useEffect(() => {
    const incrementNumbers = (key, target, delay) => {
      let current = runningNumbers[key];
      if (current < target) {
        const increment = Math.ceil((target - current) / 3);
        setTimeout(() => {
          setRunningNumbers(prev => ({
            ...prev,
            [key]: Math.min(prev[key] + increment, target),
          }));
        }, delay);
      }
    };

    incrementNumbers('peopleInCampain', stats.peopleInCampain, 50);
    incrementNumbers('peopleWithCommitments', stats.peopleWithCommitments, 50);
    incrementNumbers('totalCommitted', stats.totalCommitted, 50);
    incrementNumbers('totalPaid', stats.totalPaid, 50);
  }, [stats, runningNumbers]);
  // if(isLoading){
  //   console.log("Loading state active...");

  //   return <Spinner/>;
  // }
  if(isLoading){
    return <Spinner/>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6 border-button ">ניהול {campainName} <span className='text-gray-600'>טווח תאריכים</span>: {campainHebrewDatesRange.startDate} - {campainHebrewDatesRange.endDate}</h1>

      {/* הצגת מספרים רצים */}
      <div className="grid grid-cols-2 gap-8 text-center mb-6">
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">אנשים בקמפיין</h2>
          <p className="text-3xl font-bold text-blue-600">{runningNumbers.peopleInCampain}</p>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">אנשים עם התחייבויות</h2>
          <p className="text-3xl font-bold text-blue-600">{runningNumbers.peopleWithCommitments}</p>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">סך ההתחייבויות</h2>
          <p className="text-3xl font-bold text-blue-600">{runningNumbers.totalCommitted} ₪</p>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">סך הכל שולם</h2>
          <p className="text-3xl font-bold text-blue-600">{runningNumbers.totalPaid} ₪</p>
          <div>
            {Object.keys(incomsByPaymentsMethods).map(key => (
              <div key={key}>
                <p className="text-gray-600">{key}: {incomsByPaymentsMethods[key]} ₪</p>
              </div>
              
            ))}
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg col-span-2 flex justify-center items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-700">סכום מינימום עבור יום הנצחה בקמפיין</h2>
          <p className="text-3xl font-bold text-blue-600">{minimumAmountForMemorialDay} ₪</p>
        </div>

      </div>

      {/* כפתורים לתחתית הדף */}
      <div className="mt-8 flex justify-center gap-4  max-w-[70vw] mx-auto">
        <button
          onClick={() => navigate(`/edit-campain/${campainName}`)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all w-1/4"
        >
          עריכת קמפיין
        </button>
        <button
          onClick={() => navigate(`/peopleincampain/${campainName}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all w-1/4"
        >
          רשימת אנשים בקמפיין
        </button>
        <button
          onClick={() => navigate(`/commitments/${campainName}`)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all w-1/4"
        >
          רשימת התחייבויות בקמפיין
        </button>
        <button
            onClick={() => navigate(`/report-commitments/${campainName}`)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all w-1/4"
        >
          הוצאת דו"ח קמפיין
        </button>
      </div>
    </div>
  );
}

export default CampainPage;
