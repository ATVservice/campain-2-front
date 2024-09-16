import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampainPeople } from '../requests/ApiRequests';

function CampainPage() {
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

  const fetchStats = async () => {
    try {
      const response = await getCampainPeople(campainId);
      console.log(response);
      
      const peopleData = response.data; // קבלת מערך האנשים
  
      // סכימה של מספר האנשים בקמפיין
      const peopleInCampain = peopleData.length;
  
      // עדכון הסטטיסטיקות ב-state
      setStats({
        peopleInCampain,
        peopleWithCommitments: 0, // אין צורך לעדכן אם לא רוצים להשתמש
        totalCommitted: 0, // אין צורך לעדכן אם לא רוצים להשתמש
        totalPaid: 0, // אין צורך לעדכן אם לא רוצים להשתמש
      });
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    }
  };

  // שימוש ב-useEffect להפעלת הפונקציה fetchStats בעת טעינת הדף
  useEffect(() => {
    fetchStats(); // קריאה לפונקציה המעדכנת את הנתונים
  }, [campainId]); // קריאה מחדש בכל פעם שה-campainId משתנה
  


  useEffect(() => {
    const incrementNumbers = (key, target, delay) => {
      let current = runningNumbers[key];
      if (current < target) {
        const increment = Math.ceil((target - current) / 20);
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">ניהול קמפיין</h1>

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
        </div>
      </div>

      {/* כפתורים לתחתית הדף */}
      <div className="mt-8 flex justify-center gap-4">
        <button 
          onClick={() => navigate(`/peopleincampain/${campainId}`)} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          רשימת אנשים בקמפיין
        </button>
        <button 
          onClick={() => navigate(`/campain-commitments-list/${campainId}`)} 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          רשימת התחייבויות בקמפיין
        </button>
      </div>
    </div>
  );
}

export default CampainPage;
