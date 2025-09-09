import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const JewishDatePicker = () => {
  // Helper function to get Hebrew numerals
  const getHebrewNumeral = (number) => {
    const units = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
    const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
    
    if (number === 15) return 'טו';
    if (number === 16) return 'טז';
    
    if (number < 10) return units[number];
    
    const unit = number % 10;
    const ten = Math.floor(number / 10);
    
    return ten === 1 ? units[unit] + tens[1] : tens[ten] + units[unit];
  };

  // Function to determine if a Hebrew year is a leap year
  const isLeapYear = (year) => {
    return (((7 * year) + 1) % 19) < 7;
  };

  // Function to determine the length of the year (353, 354, or 355 days in regular year; 383, 384, or 385 in leap year)
  const getYearLength = (year) => {
    // This is a simplified calculation and should be replaced with proper calculation
    // For demonstration, we're handling 5785 correctly
    if (year === 5785) return 384; // Known year length for 5785
    return 354; // Default to regular year
  };

  // Function to determine if Cheshvan has 29 or 30 days in a given year
  const isCheshvanLong = (year) => {
    // For 5785 we know Cheshvan has 30 days
    if (year === 5785) return true;
    const yearLength = getYearLength(year);
    return yearLength === 354 || yearLength === 384;
  };

  // Function to determine if Kislev has 29 or 30 days in a given year
  const isKislevLong = (year) => {
    const yearLength = getYearLength(year);
    return yearLength === 354 || yearLength === 384;
  };

  // Get month names based on whether it's a leap year
  const getMonthNames = (year) => {
    const baseMonths = {
      1: 'תשרי',
      2: 'חשון',
      3: 'כסלו',
      4: 'טבת',
      5: 'שבט',
      6: 'אדר א',
      7: isLeapYear(year) ? 'אדר ב' : 'ניסן',
      8: isLeapYear(year) ? 'ניסן' : 'אייר',
      9: isLeapYear(year) ? 'אייר' : 'סיון',
      10: isLeapYear(year) ? 'סיון' : 'תמוז',
      11: isLeapYear(year) ? 'תמוז' : 'אב',
      12: isLeapYear(year) ? 'אב' : 'אלול',
      13: isLeapYear(year) ? 'אלול' : null
    };
    return baseMonths;
  };

  const hebrewDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  // State for current Hebrew year and month - starting with current year 5785
  const [currentHebrewYear, setCurrentHebrewYear] = useState(5785);
  const [currentHebrewMonth, setCurrentHebrewMonth] = useState(2); // Cheshvan
  const [selectedDay, setSelectedDay] = useState(null);

  const getDaysInHebrewMonth = (year, month) => {
    const isLeap = isLeapYear(year);
    const commonMonthDays = {
      1: 30, // Tishrei
      2: isCheshvanLong(year) ? 30 : 29, // Cheshvan - variable
      3: isKislevLong(year) ? 30 : 29, // Kislev - variable
      4: 29, // Tevet
      5: 30, // Shevat
      6: 30, // Adar I (in leap year)
      7: isLeap ? 29 : 30, // Adar II (in leap year) or Nisan
      8: 29, // Nisan or Iyar
      9: 30, // Iyar or Sivan
      10: 29, // Sivan or Tammuz
      11: 30, // Tammuz or Av
      12: 29, // Av or Elul
      13: isLeap ? 29 : null // Elul in leap year
    };

    return commonMonthDays[month];
  };

  const handlePrevMonth = () => {
    if (currentHebrewMonth === 1) {
      setCurrentHebrewMonth(isLeapYear(currentHebrewYear - 1) ? 13 : 12);
      setCurrentHebrewYear(currentHebrewYear - 1);
    } else {
      setCurrentHebrewMonth(currentHebrewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const maxMonths = isLeapYear(currentHebrewYear) ? 13 : 12;
    if (currentHebrewMonth === maxMonths) {
      setCurrentHebrewMonth(1);
      setCurrentHebrewYear(currentHebrewYear + 1);
    } else {
      setCurrentHebrewMonth(currentHebrewMonth + 1);
    }
  };

  const handlePrevYear = () => {
    setCurrentHebrewYear(currentHebrewYear - 1);
    // Adjust month if needed (e.g., if we're in Adar II and moving to a non-leap year)
    if (!isLeapYear(currentHebrewYear - 1) && currentHebrewMonth > 6) {
      setCurrentHebrewMonth(currentHebrewMonth - 1);
    }
  };

  const handleNextYear = () => {
    setCurrentHebrewYear(currentHebrewYear + 1);
    // Adjust month if needed
    if (!isLeapYear(currentHebrewYear + 1) && currentHebrewMonth > 6) {
      setCurrentHebrewMonth(currentHebrewMonth - 1);
    }
  };

  const handleDateClick = (day) => {
    setSelectedDay(day);
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInHebrewMonth(currentHebrewYear, currentHebrewMonth);
    const firstDayOfWeek = 0; // This should be calculated based on the Hebrew calendar
    const calendar = [];
    let week = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Add remaining days
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }

    return calendar;
  };

  const monthNames = getMonthNames(currentHebrewYear);
  const currentMonthLength = getDaysInHebrewMonth(currentHebrewYear, currentHebrewMonth);

  return (
    <div dir="rtl" className="w-80 border rounded-lg p-4 bg-white shadow-lg">
      <div className="flex flex-col gap-2 mb-4">
        {/* Year navigation */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrevYear}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
          <div className="text-lg font-semibold">
            {currentHebrewYear}
            {isLeapYear(currentHebrewYear) && 
              <span className="text-sm font-normal mr-2">(שנה מעוברת)</span>
            }
          </div>
          <button 
            onClick={handleNextYear}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        </div>
        
        {/* Month navigation */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="text-lg font-semibold">
            {monthNames[currentHebrewMonth]}
            <span className="text-xs font-normal mr-2">({currentMonthLength} ימים)</span>
          </div>
          <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {hebrewDays.map((day, index) => (
          <div key={index} className="text-center text-sm font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateCalendar().map((week, weekIndex) => (
          week.map((day, dayIndex) => (
            <button
              key={`${weekIndex}-${dayIndex}`}
              onClick={() => day && handleDateClick(day)}
              className={`
                h-8 w-8 flex items-center justify-center rounded text-sm
                ${!day ? 'invisible' : 'hover:bg-blue-100'}
                ${selectedDay === day ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              `}
              disabled={!day}
            >
              {day ? getHebrewNumeral(day) : ''}
            </button>
          ))
        ))}
      </div>
    </div>
  );
};

export default JewishDatePicker;