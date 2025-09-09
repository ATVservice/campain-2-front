import React, { useState, useEffect,useMemo,useRef  } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { HDate, gematriya, months } from '@hebcal/hdate';
import { getCampains,getCommitment,getMemorialDaysByRangeDates } from "../requests/ApiRequests";
import { useNavigate,useSearchParams ,useLocation } from 'react-router-dom';
import MemorialDayDetails from './MemorialDayDetails';
import AddMemorialDayToPerson from './AddMemorialDayToPerson';
import Spinner from '../components/Spinner';
import { typedArrayFor } from 'pdf-lib';


function MemorialBoard() {
  const hebrewMonths = {
    'TISHREI': 'תשרי',
    'CHESHVAN': 'חשוון',
    'KISLEV': 'כסלו',
    'TEVET': 'טבת',
    'SH\'VAT': 'שבט', 
    'ADAR I': 'אדר א׳',
    'ADAR II': 'אדר ב׳',
    'ADAR': 'אדר',
    'NISAN': 'ניסן',
    'IYYAR': 'אייר',
    'SIVAN': 'סיון',
    'TAMUZ': 'תמוז',
    'AV': 'אב',
    'ELUL': 'אלול'
  };

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let campainStartDate = queryParams.get("startDate")||"";
  
  const [campains, setCampains] = useState([]);
  const [isCommitmentLoading, setCommitmentIsLoading] = useState(true);
  const [isCampainsLoading, setCampainsIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const memorialDaysMapRef = useRef(new Map());

  const CALENDAE_STATE = 'calendarState';
  
  function getInitialState() {
    if(campainStartDate)
    {
      campainStartDate= new HDate(new Date(campainStartDate));
      const currentDate = new HDate(1, campainStartDate.mm, campainStartDate.yy);
      localStorage.setItem(CALENDAE_STATE, JSON.stringify({ mm: currentDate.mm, yy: currentDate.yy }));
      return currentDate;

    }

    const storedState = localStorage.getItem(CALENDAE_STATE);
    if (storedState) {
    const { mm, yy } = JSON.parse(storedState);
    return new HDate(1, mm, yy);
  }
  return new HDate(1, new HDate().mm, new HDate().yy);
}
const [currentDate, setCurrentDate] = useState(getInitialState());

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setCampainsIsLoading(true);
        const response = await getCampains();
        setCampains(response.data.data.campains||[]);
        if(campainStartDate) swichCampain(campainStartDate);

      } catch (error) {
      }
      finally {
        setCampainsIsLoading(false);
        setIsLoading(false);
      }

    };
    fetchData();

  }, []);
  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setCommitmentIsLoading(true);
        const response = await getCommitment();


        const gregStartDate = currentDate.greg();
        const daysInMonth = currentDate.daysInMonth();
        const gregEndDate = new HDate(1+daysInMonth, currentDate.mm, currentDate.yy).greg();
        const response2 = await getMemorialDaysByRangeDates(gregStartDate, gregEndDate);
        populateMemorialDaysMap(response2.data||[]);

        
      } catch (error) {
      }
      finally {
        setCommitmentIsLoading(false);
        setIsLoading(false);
      }

    };
    fetchData();

  }, [currentDate]);

  function populateMemorialDaysMap(days) {
    // console.log(days);
    days.forEach(day => {
      memorialDaysMapRef.current.set(new Date(day.date).toLocaleDateString('he-IL'), day);
    });
    console.log(memorialDaysMapRef.current);
  }
  


  // console.log(new HDate(1,new HDate().mm,new HDate().yy));


function getHebrewMonths(year) {
    const hebrewDate = new HDate(1, 7, year); // 1st of Tishrei
    const isLeapYear = hebrewDate.isLeapYear();
    
    const months = [
        "Tishrei", "CHESHVAN", "Kislev", "Tevet", "SH\'VAT"
    ];

    if (isLeapYear) {
        months.push("Adar I", "Adar II", "Nisan", "Iyyar", "SIVAN", "Tamuz", "Av", "Elul");
    } else {
        months.push("Adar", "Nisan", "Iyyar", "SIVAN", "Tamuz", "Av", "Elul");
    }
    
    return months;
}


  // Handle month change using navigation buttons
  function changeDate(change) {
    let d = new HDate(currentDate);

  if(change == -1){
    do{
      d= d.prev()

    }
    while(d.dd!=1);
  }
  else
  {
    do{
      d= d.next()
  
    }
    while(d.dd!=1);

  }
    setCurrentDate(new HDate(d));
  }
    function handleMonthChange(event) {
    setCurrentDate(new HDate(1, event.target.value, currentDate.yy)); // Update the current date
  }


  function isCampainDay(hdate) {
    // Return false if there are no campaigns
    // if (campains.length === 0) return false;
    
    // Loop through each campaign in the array
    for (let i = 0; i < campains.length; i++) {
      const campaign = campains[i];
      const campainStartDate = new HDate(new Date(campaign.startDate));
      const campainEndDate = new HDate(new Date(campaign.endDate));
      if(hdate.deltaDays(campainStartDate) < 0 || hdate.deltaDays(campainEndDate) > 0){
        continue;
      }
      if(hdate.deltaDays(campainStartDate) >= 0 && hdate.deltaDays(campainEndDate) <= 0){
        
        return campaign
      }
      return false;
      
    }
  
    return false;
  }
  
  // Render the days of the month
    function renderDays(monthDaysLength, hdate) {
    
    const elements = [];
    // console.log(monthDaysLength);
    for (let i = 1; i <= monthDaysLength; i++) {
      // Create a new HDate instance for the current day
      
      // Check if the current day is a campaign day
      let backgroundColor = null
      let addOrShowMemorialMemorialDay= null
      const isCampaignDay = isCampainDay(new HDate(i, hdate.mm, hdate.yy));
      if(isCampaignDay)
      {

        // let backgroundColor = 'hover:bg-blue-200';
          const gerdDate  = new HDate(i, hdate.mm, hdate.yy).greg()
         
          if(isCampaignDay.types.length > 0){
            
            addOrShowMemorialMemorialDay = ()=>{navigate(`/add-memorial-day-to-person?CampainName=${isCampaignDay.CampainName}&campainId=${isCampaignDay._id}&date=${gerdDate}&campainId`)}
          }
            
          backgroundColor = 'bg-green-400 text-black';
          if(memorialDaysMapRef.current.has(gerdDate.toLocaleDateString('he-IL'))){
            const memoDay = memorialDaysMapRef.current.get(gerdDate.toLocaleDateString('he-IL'));
            if(memoDay.types.length === isCampaignDay.types.length){
              backgroundColor = 'bg-red-400 text-black';
            }
              else{
                backgroundColor = 'bg-orange-400 text-black';
              }
              
            }
          
          
      }
      

      
      elements.push(
        <div
          key={i}
          className={`py-[10px] border border-gray-300 flex flex-col items-center flex-wrap justify-center cursor-pointer ${backgroundColor}`}
          onClick={addOrShowMemorialMemorialDay}
        >
          <div className="text-xl">{gematriya(i)}</div>
          <div className="text-xs ">{isCampaignDay?isCampaignDay.CampainName:""}</div>
        </div>
      );
    }
  
    return elements;
  }
  
  // Render empty days at the start of the month
  function renderEmptyDays(weekday) {
    const elements = [];
    for (let i = 0; i < weekday; i++) {
      elements.push(
        <div key={i} className="py-[10px] border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-blue-200">
          <div className="text-xl"></div>
        </div>
      );
    }
    return elements;
  }
  const YearsOptions = ()=>{
    const minYear = currentDate.yy - 200; // 200 years before the current year
    const maxYear = currentDate.yy + 200; // 200 years after the current year
  
    const years = Array.from(
      { length: maxYear - minYear + 1 },
      (_, i) => minYear + i
    ); // Generate a range of years from minYear to maxYear
    return years


  }  
  let yearsOptions = YearsOptions()


  function handelYearChange(event) {
    setCurrentDate(new HDate(1, currentDate.mm, event.target.value));

  }
  if(isCampainsLoading || isCommitmentLoading){
      return <div><Spinner/></div>;
    
  }

  function swichCampain(campainStartDate){
    campainStartDate= new HDate(new Date(campainStartDate));
    const currentDate = new HDate(1, campainStartDate.mm, campainStartDate.yy);
    localStorage.setItem(CALENDAE_STATE, JSON.stringify({ mm: currentDate.mm, yy: currentDate.yy }));

    setCurrentDate(currentDate);
  }
  if(isLoading){
    return <div><Spinner/></div>;
  }

  return (
    <section className='flex gap-2 my-2'>
  <div className='grid grid-cols-2 gap-4 h-full content-start p-4'>
    {campains.map((campain, index) => (
      <button
        key={index}
        className='bg-blue-200 text-blue-900 text-center px-[40px] py-[20px] rounded-lg shadow-md hover:bg-blue-300 whitespace-nowrap text-overflow-ellipsis overflow-hidden'
        onClick={() => swichCampain(campain.startDate)}
      >
        {campain.CampainName}
      </button>
    ))}
  </div>
<div dir="rtl" className="max-w-3xl w-full mx-auto overflow-hidden rounded-lg border border-gray-300 p-4 max-h-screen">
        <div className="bg-blue-500 text-white p-4">
          <div className="flex justify-between items-center">
            <button onClick={() => changeDate(-1)} className="text-white hover:bg-blue-600 p-2 rounded-full">
              <BiChevronRight size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{hebrewMonths[currentDate.getMonthName().toUpperCase()]}</h2>
              <h1 className="text-3xl font-bold">{gematriya(currentDate.getFullYear())}</h1>
            </div>
            <button onClick={() => changeDate(1)} className="text-white hover:bg-blue-600 p-2 rounded-full">
              <BiChevronLeft size={24} />
            </button>
          </div>
        </div>
        {/* Dropdown to select Hebrew months */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-md shadow-lg">
        {/* Month Selector */}
        <div className="flex items-center gap-2">
        <label htmlFor="month-select" className="font-semibold text-gray-700">חודש:</label>
        <select
        id="month-select"
        className="border border-gray-300 px-3 py-2 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={currentDate.getMonthName().toUpperCase()} // Set the selected value of the <select>
        onChange={handleMonthChange}
      >
        {getHebrewMonths(currentDate.yy).map((month) => (
      <option key={month} value={month.toUpperCase()}>
        {hebrewMonths[month.toUpperCase()]}
      </option>
        ))}
      </select>
        </div>
      
        {/* Year Selector */}
        <div className="flex items-center gap-2">
      <label htmlFor="year-select" className="font-semibold text-gray-700">שנה:</label>
      <select
        id="year-select"
        className="border border-gray-300 px-3 py-2 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={currentDate.yy}
        onChange={handelYearChange}
      >
        {yearsOptions.map((year) => (
          <option key={year} value={year}>
            {gematriya(year)}
          </option>
        ))}
      </select>
        </div>
      </div>
        <div className="p-2">
          <div className="grid grid-cols-7 text-center border-collapse border border-gray-300">
            {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'].map((day) => (
              <div key={day} className="font-bold p-2 bg-blue-600 border border-gray-300">{day}</div>
            ))}
            {renderEmptyDays(new HDate(1, currentDate.mm, currentDate.yy).getDay())}
            {renderDays(currentDate.daysInMonth(), currentDate)}
          </div>
        </div>
        <div>
        </div>
      </div>
    </section>

  );
}

export default MemorialBoard;
