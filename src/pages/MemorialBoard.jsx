import React, { useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

function MemorialBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  let firstDayOfWeek = new Date(year, month, 1).getDay();
  let hebrewMonths = getHebrewMonths(year, month);
  const daysInMonth = generateHebrewDatesInMonth(year, month);
  // const daysInMonth = generateDatesInMonth(year, month);
  const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const changeDate = (change) => setCurrentDate(new Date(year, month + change, 1));
  const gregorianMonthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hebrewYear = getHebrewYearString(currentDate);
  const hebrewMonthYear = `${hebrewMonths} ${hebrewYear}`;
  const [selectedDay, setSelectedDay] = useState(new Date());
  // function selectedDateEqualGregDate(date) {
  //   return selectedDay.getFullYear() === date.getFullYear() &&
  //          selectedDay.getMonth() === date.getMonth() &&
  //          selectedDay.getDate() === date.getDate();
  // }
  
  const hebrewLetters = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", 
    "יא", "יב", "יג", "יד", "טו", "טז", "יז", "יח", "יט", "כ", 
    "כא", "כב", "כג", "כד", "כה", "כו", "כז", "כח", "כט", "ל"];

  function getHebrewDate(date) {
    const options = { calendar: 'hebrew', day: 'numeric', month: 'long' };
    const hebrewDate = new Intl.DateTimeFormat('he-IL', options).format(date);
    const [day, month] = hebrewDate.split(' ');
    
    const hebrewLetters = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", 
      "יא", "יב", "יג", "יד", "טו", "טז", "יז", "יח", "יט", "כ", 
      "כא", "כב", "כג", "כד", "כה", "כו", "כז", "כח", "כט", "ל"];
      
      const hebrewDay = hebrewLetters[parseInt(day) - 1];

    return { day: hebrewDay, month:month.replace('ב', '') };
  }

  function getHebrewYearString(date) {
    const hebrewYear = new Intl.DateTimeFormat('he-IL', { calendar: 'hebrew', year: 'numeric' }).format(date);
    // console.log(hebrewYear);
    const yearNumber = parseInt(hebrewYear);
    const letterValues = {
      'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
      'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
      'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
    };
    
    const hebrewLetters = Object.keys(letterValues);
    let result = '';
    let remaining = yearNumber % 1000;  // We only want the last three digits
    
    while (remaining > 0) {
      for (let i = hebrewLetters.length - 1; i >= 0; i--) {
        if (letterValues[hebrewLetters[i]] <= remaining) {
          result += hebrewLetters[i];
          remaining -= letterValues[hebrewLetters[i]];
          break;
        }
      }
    }

    // Add the quotation mark before the last letter
    if (result.length > 1) {
      result = result.slice(0, -1) + '"' + result.slice(-1);
    }
    console.log(result);

    return result;
  }

  function getHebrewMonths(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstHebrewMonth = firstDay.toLocaleDateString('he-IL', { month: 'long', calendar: 'hebrew' });
    const lastHebrewMonth = lastDay.toLocaleDateString('he-IL', { month: 'long', calendar: 'hebrew' });
    
    if (firstHebrewMonth === lastHebrewMonth) {
      return firstHebrewMonth;
    } else {
      return `${firstHebrewMonth}-${lastHebrewMonth}`;
    }
  }
  

  function generateDatesInMonth(year, month) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  const isToday = (date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && 
           date.getMonth() === today.getMonth() && 
           date.getDate() === today.getDate();
  }
  function handelSelectedDay(day) {
    // console.log(new Date(day.gregorian).getDate());
    
    // console.log(day.gregorian.getDate());
    setSelectedDay(new Date(day.gregorian));
    // console.log(getHebrewDate(day));
  }
  function generateHebrewDatesInMonth(year, month) {
    const days = [];
    
    // Find the first day of the Hebrew month
    let date = new Date(year, month, 1);
    console.log(date);
    let hebrewDate = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'short', year: 'numeric'}).format(date);
    console.log(hebrewDate);
    // Adjust to start at the first day of the Hebrew month
    while (hebrewDate.split(' ')[0] !== "1") {
      date.setDate(date.getDate() - 1);
      hebrewDate = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric'}).format(date);
    }
    // Loop through the entire Hebrew month
    const currentMonthName = hebrewDate.split(' ')[1];


    const hebrewDaysInWeek = {
      "יום ראשון": 0,
      "יום שני": 1,
      "יום שלישי": 2,
      "יום רביעי": 3,
      "יום חמישי": 4,
      "יום שישי": 5,
      "שבת": 6
    };
        const key =  new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long',weekday: 'long'}).formatToParts(date)[0].value;
        // console.log(key);
    firstDayOfWeek = hebrewDaysInWeek[key];
    hebrewMonths=   new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long',weekday: 'short'}).formatToParts(date)[4].value;
// console.log(hebrewDaysInWeek[6]);
    
    while (true) {
      // const temp = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long',weekday: 'short'}).formatToParts(date);
      // console.log(temp);
      const [day, monthName] = hebrewDate.split(' ');
      const formattedDate = new Date(date);
  
      date.setDate(date.getDate() + 1);
      hebrewDate = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
      // console.log(temp);
      
      // Move to the next day
      // Stop if the Hebrew month changes
      if (monthName !== currentMonthName) {
        break;
      }
      else
      {
        days.push({ gregorian: formattedDate, hebrewDay: day, hebrewMonth: monthName });

      }
    
      // console.log(formattedDate.getDate());
    }
    console.log(days[0].gregorian)
    return days;
  }
  
  

  return (
<div dir="rtl" className="max-w-4xl w-full mx-auto overflow-hidden rounded-lg border border-gray-300">
  <div className="bg-blue-500 text-white p-4">
    <div className="flex justify-between items-center">
      <button onClick={() => changeDate(-1)} className="text-white hover:bg-blue-600 p-2 rounded-full">
        <BiChevronRight size={24}/>
      </button>
      <div className="text-center">
        {/* <h2 className="text-2xl font-bold">{gregorianMonthYear}</h2> */}
        <h2 className="text-2xl font-bold">{hebrewMonthYear}</h2>
      </div>
      <button onClick={() => changeDate(1)} className="text-white hover:bg-blue-600 p-2 rounded-full">
        <BiChevronLeft size={24}/>
      </button>
    </div>
  </div>

  <div className="p-2">
    <div className="grid grid-cols-7 text-center border-collapse border border-gray-300">
      {hebrewDays.map(day => 
        <div key={day} className="font-bold p-2 bg-blue-200 border border-gray-300">{day}</div>)}

      {Array.from({ length: firstDayOfWeek }).map((_, index) => 
        <div key={`empty-${index}`} className="p-2 border border-gray-300 bg-white"/>)}

      {daysInMonth.map((day) => {
        return (
          <div 
            key={day.gregorian.getTime()}
            className={`h-[80px] border border-gray-300 flex items-center justify-center cursor-pointer ${selectedDay?.getDate() === day.gregorian.getDate() ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}
            onClick={() => handelSelectedDay(day)}
          >
            <div className="text-xl">{hebrewLetters[day.hebrewDay-1]}</div>
          </div>
        );
      })}
    </div>
  </div>
</div>

  )
}

export default MemorialBoard