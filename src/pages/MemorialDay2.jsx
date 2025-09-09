import React, { useState } from 'react';
import { HDate, gematriya, months } from '@hebcal/core';

function HebrewCalendar() {
  const hebrewMonths = {
    'Tishrei': 'תשרי',
    'Cheshvan': 'חשוון',
    'Kislev': 'כסלו',
    'Tevet': 'טבת',
    'Shevat': 'שבט',
    'Adar I': 'אדר א׳',  // Adar I (only in leap years)
    'Adar II': 'אדר ב',  // Adar I (only in leap years)
    'Adar': 'אדר',      // Adar (or Adar II in leap years)
    'Nisan': 'ניסן',
    'Iyyar': 'אייר',
    'Sivan': 'סיון',
    'Tamuz': 'תמוז',
    'Av': 'אב',
    'Elul': 'אלול',
  };
    
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new HDate();
    // console.log(now.getTishreiMonth);
    return { month: now.getMonth(), year: now.getFullYear()};
  });
  console.log(currentDate);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      let newMonth = prev.month - 1;
      let newYear = prev.year;
      if (newMonth< 1) {
        newMonth = new HDate(1, newMonth, newYear).isLeapYear() ? 13 : 12;
      }
      if(new HDate(1, newMonth, newYear).getMonthName() === 'Elul') newYear--;

      return { month: newMonth, year: newYear };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      let newMonth = prev.month + 1;
      let newYear = prev.year;
      if (newMonth > 13) {
        newMonth = 1;
        newYear++;
      }
      return { month: newMonth, year: newYear };
    });
  };

  const getHDate = () => {
      let month = currentDate.month;
    //   let month = (currentDate.month + 6) % 13 + 1;
      console.log(currentDate);
    let year = currentDate.year;
    // if (currentDate.month >= 8) year++;  // Adjust year for months after Tishrei
    return new HDate(1, month, year);
  };

  const hdate = getHDate();
//   console.log(hdate);
  const isLeapYear = hdate.isLeapYear();
  console.log(isLeapYear);

//   let monthName = hebrewMonths[currentDate.month];
  let monthName = hdate.getMonthName();
//   if (currentDate.month === 7 && isLeapYear) {
//     monthName = 'אדר ב׳';  // Adar II in leap years
//   } else if (currentDate.month === 6 && !isLeapYear) {
//     monthName = 'אדר';  // Regular Adar in non-leap years
//   }

  const yearInGematria = gematriya(currentDate.year.toString());
//   console.log(currentDate);

  const daysInMonth = hdate.daysInMonth();

  const firstDayOfWeek = hdate.getDay();
//   console.log(firstDayOfWeek);

  // Generate calendar grid
  const calendarGrid = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarGrid.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push(new HDate(i, hdate.getMonth(), hdate.getFullYear()));
  }

  const hebrewWeekdays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button onClick={handlePreviousMonth}>&larr; Previous</button>
        <h1 className="text-center text-2xl font-bold">
          {monthName} {yearInGematria}
        </h1>
        <button onClick={handleNextMonth}>Next &rarr;</button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {hebrewWeekdays.map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
        {calendarGrid.map((date, index) => (
          <div key={index} className="border p-2 h-20 flex items-center justify-center">
            {date ? (
              <span className="text-lg font-semibold">{gematriya(date.getDate())}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HebrewCalendar;