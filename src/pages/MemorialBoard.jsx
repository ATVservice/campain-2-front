import React, { useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

function MemorialBoard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = generateDatesInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const changeDate = (change) => setCurrentDate(new Date(year, month + change, 1));
  const gregorianMonthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hebrewMonths = getHebrewMonths(year, month);
  const hebrewYear = getHebrewYearString(currentDate);
  const hebrewMonthYear = `${hebrewMonths} ${hebrewYear}`;
  const [selectedDay, setSelectedDay] = useState(new Date());

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
    setSelectedDay(day);
    console.log(getHebrewDate(day));
  }


  return (
    <div dir='rtl' className='max-w-md mx-auto overflow-hidden'>
      <div className='flex flex-col items-center justify-between bg-blue-500 text-white p-4'>
        <div className='flex w-full justify-between items-center'>
          <button onClick={() => changeDate(-1)} className='text-white hover:bg-blue-600 p-2 rounded-full'> 
            <BiChevronRight size={20}/>
          </button>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>{gregorianMonthYear}</h2>
            <p className='text-sm'>{hebrewMonthYear}</p>
          </div>
          <button onClick={() => changeDate(1)} className='text-white hover:bg-blue-600 p-2 rounded-full'> 
            <BiChevronLeft size={20}/>
          </button>
        </div>
      </div>

      <div className='grid grid-cols-7 gap-1 p-4 text-center'>
        {hebrewDays.map(day => 
          <div key={day} className='font-bold p-2'>{day}</div>)}

        {Array.from({ length: firstDayOfWeek }).map((_, index) => 
          <div key={`empty-${index}`} className='p-2'/>)}

        {daysInMonth.map((day) => {
          const hebrewDate = getHebrewDate(day);
          return (
            <div 
              key={day}
              className={`p-2 ${selectedDay.getDate() === day.getDate() ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'} cursor-pointer`}
              onClick={() => handelSelectedDay(day)}
            >
              <div>{day.getDate()}</div>
              <div className='text-xs'>{hebrewDate.day} {hebrewDate.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default MemorialBoard