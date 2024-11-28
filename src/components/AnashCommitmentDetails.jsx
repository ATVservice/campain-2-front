import React, { useState, useEffect,forwardRef } from "react";
import { ReactJewishDatePicker } from "react-jewish-datepicker";
import "react-jewish-datepicker/dist/index.css";
import { BiShekel } from "react-icons/bi";
import { toast } from "react-toastify";


function AnashCommitmentDetails({
  commitmentForm = {},
  setCommitmentForm = () => {},
  campain = {},
  allCampainMemorialDates = [],
  commitmentAmountBefourChange = 0
}) {
  const [memorialDaysToDisplay, setMemorialDaysToDisplay] = useState([
    ...(commitmentForm?.MemorialDays ?? []),
  ]);
  const calculateUpdatedForm = (prevCommitmentForm, name, value) => {
    const updatedForm = {
      ...prevCommitmentForm,
      [name]: value,
    };
  
    if (name === "CommitmentAmount") {
      updatedForm.AmountRemaining = parseFloat(value) - parseFloat(prevCommitmentForm.AmountPaid);
    }
    else if (name === "AmountPaid") {
      updatedForm.AmountRemaining = parseFloat(prevCommitmentForm.CommitmentAmount) - parseFloat(value);
    }
    else if (name === "NumberOfPayments") 
    {
      updatedForm.PaymentsRemaining = parseInt(value) - parseInt(prevCommitmentForm.PaymentsMade);

    }
    else if (name === "PaymentsMade" && commitmentForm.NumberOfPayments) {
      updatedForm.PaymentsRemaining = parseInt(prevCommitmentForm.NumberOfPayments) - parseInt(value);
    }
  
    return updatedForm;
  };
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "CommitmentAmount" || name === "AmountPaid" || name === "NumberOfPayments" || name === "PaymentsMade" || name === "AmountRemaining" || name === "PaymentsRemaining")
    {
      const parsedValue = parseFloat(value).toFixed(2);
      if ((isNaN(parsedValue) || parsedValue < 0) && value !== "")  {
        toast.error("Please enter a valid number.");
        return;
      }
    }
  
    setCommitmentForm((prevCommitmentForm) =>
      calculateUpdatedForm(prevCommitmentForm, name, value)
    );
  };
  
  
  
  const handleDateChange = (displayIndex, selectedDay) => {

    const newMemorialDay = {
      ...memorialDaysToDisplay[displayIndex],
      date: selectedDay.date,
      hebrewDate: selectedDay.jewishDateStrHebrew,
    };

    // Update only the display array
    setMemorialDaysToDisplay((prevMemorialDaysToDisplay) => {
      const updatedDisplayDays = [...prevMemorialDaysToDisplay];
      updatedDisplayDays[displayIndex] = newMemorialDay;
      return updatedDisplayDays;
    });

    // Commit to actual state only if valid
    setCommitmentForm((prevCommitmentForm) => {
      const existingIndex = prevCommitmentForm.MemorialDays.findIndex((day) =>
        isTheSameDate(
          new Date(day.date),
          new Date(memorialDaysToDisplay[displayIndex].date)
        )
      );

      if (existingIndex !== -1) {
        const updatedMemorialDays = [...prevCommitmentForm.MemorialDays];
        updatedMemorialDays[existingIndex] = newMemorialDay;
        return {
          ...prevCommitmentForm,
          MemorialDays: updatedMemorialDays,
        };
      } else {
        return {
          ...prevCommitmentForm,
          MemorialDays: [...prevCommitmentForm.MemorialDays, newMemorialDay],
        };
      }
    });
  };
  const removeMemorialDay = (displayIndex) => {
    const memorialDayToRemove = memorialDaysToDisplay[displayIndex];

    setMemorialDaysToDisplay((prevMemorialDaysToDisplay) =>
      prevMemorialDaysToDisplay.filter((_, index) => index !== displayIndex)
    );

    setCommitmentForm((prevCommitmentForm) => {
      const updatedMemorialDays = prevCommitmentForm.MemorialDays.filter(
        (day) =>
          !isTheSameDate(new Date(day.date), new Date(memorialDayToRemove.date))
      );
      return {
        ...prevCommitmentForm,
        MemorialDays: updatedMemorialDays,
      };
    });
  };
  function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const allowedSelectionRange = (day) => {
    const normalizedDay = normalizeDate(day.date);
    const normalizedStartDate = normalizeDate(new Date(campain?.startDate));
    const normalizedEndDate = normalizeDate(new Date(campain?.endDate));
    if (
      normalizedDay < normalizedStartDate ||
      normalizedDay > normalizedEndDate
    ) {
      return false;
    }
    for (let i = 0; i < allCampainMemorialDates?.length; i++) {
      if (
        isTheSameDate(new Date(day.date), new Date(allCampainMemorialDates[i]))
      ) {
        return false;
      }
      }
      for (let i = 0; i < commitmentForm.MemorialDays.length; i++) {
        if (
          isTheSameDate(
            new Date(commitmentForm.MemorialDays[i].date),
            new Date(day.date)
          )
        ) {
          return false;
        }
      }

    return true;
  };
  function isTheSameDate(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  function handelCommartionChange(displayIndex, event) {
    console.log(commitmentForm.MemorialDays);
    const { name, value } = event.target;

    // Step 1: Update memorialDaysToDisplay state
    setMemorialDaysToDisplay((prevMemorialDaysToDisplay) => {
      const updatedDisplayDays = [...prevMemorialDaysToDisplay];
      updatedDisplayDays[displayIndex] = {
        ...updatedDisplayDays[displayIndex],
        [name]: value,
      };
      return updatedDisplayDays;
    });

    // Step 2: Update commitmentForm.MemorialDays
    setCommitmentForm((prevCommitmentForm) => {
      const memorialDayToUpdate = memorialDaysToDisplay[displayIndex]; // Current display data
      const updatedMemorialDay = { ...memorialDayToUpdate, [name]: value };

      const existingIndex = prevCommitmentForm.MemorialDays.findIndex((day) =>
        isTheSameDate(new Date(day.date), new Date(updatedMemorialDay.date))
      );

      if (existingIndex !== -1) {
        // Update existing MemorialDay
        const updatedMemorialDays = [...prevCommitmentForm.MemorialDays];
        updatedMemorialDays[existingIndex] = updatedMemorialDay;
        console.log("e");

        return {
          ...prevCommitmentForm,
          MemorialDays: updatedMemorialDays,
        };
      } else {
        // Add new MemorialDay
        return {
          ...prevCommitmentForm,
        };
      }
    });
  }

  const AddMemorialDay = () => {
    console.log(commitmentForm.MemorialDays);

    const remainingMemorialDays =
      Math.floor(
        commitmentAmountBefourChange / campain.minimumAmountForMemorialDay
      ) - memorialDaysToDisplay.length;

    if (remainingMemorialDays <= 0) {
      toast.error("התחייבות אינה מספיקה להוספת עוד ימי הנצחה");
      return;
    }

    setMemorialDaysToDisplay((prevMemorialDaysToDisplay) => [
      ...prevMemorialDaysToDisplay,
      { date: "", hebrewDate: "" },
    ]);
  };

  return (
    <div>
      <form className="max-w-[95vw] mx-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-[20px] border border-sky-200 p-3 rounded">
          <label>
            מזהה אנש:
            <input
              type="text"
              name="AnashIdentifier"
              value={commitmentForm.AnashIdentifier || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-200 focus:outline-none"
              readOnly
            />
          </label>
          <label>
            מספר זהות:
            <input
              type="text"
              name="PersonID"
              value={commitmentForm.PersonID || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-200 focus:outline-none"
              readOnly
            />
          </label>
          <label>
            שם:
            <input
              type="text"
              name="FirstName"
              value={commitmentForm.FirstName || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-200 focus:outline-none"
              readOnly
            />
          </label>
          <label>
            משפחה:
            <input
              type="text"
              name="LastName"
              value={commitmentForm.LastName || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-200 focus:outline-none"
              readOnly
            />
          </label>
          <label>
            סכום התחייבות:
            <input
              type="number"
              name="CommitmentAmount"
              value={commitmentForm.CommitmentAmount ?? ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label>
            סכום שולם:
            <input
              type="number"
              name="AmountPaid"
              value={commitmentForm.AmountPaid ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-200 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </label>
          <label>
            סכום שנותר:
            <input
              type="number"
              name="AmountRemaining"
              value={commitmentForm.AmountRemaining ?? ''}
              readOnly // Make it read-only since it's a calculated field
              className="mt-1 block w-full p-2 border border-gray-200 rounded bg-gray-200" // Add some visual indication it's not editable
            />{" "}
          </label>
          <label>
            מספר תשלומים:
            <input
              type="number"
              name="NumberOfPayments"
              value={commitmentForm.NumberOfPayments ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label>
            תשלומים שבוצעו:
            <input
              type="number"
              name="PaymentsMade"
              value={commitmentForm.PaymentsMade ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </label>
          <label>
            תשלומים שנותרו:
            <input
              type="number"
              name="PaymentsRemaining"
              value={commitmentForm.PaymentsRemaining ?? ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300  bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </label>
          <label>
             תשלום חודשי:
            <input
              type="number"
              name="MonthlyPayment"
              value={(commitmentForm.CommitmentAmount/commitmentForm.NumberOfPayments).toFixed(2)||''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300  bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </label>
          <label>
            מתרים:
            <input
              type="text"
              name="Fundraiser"
              value={commitmentForm.Fundraiser || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label>
            אופן התשלום:
            <select
              name="PaymentMethod"
              value={commitmentForm.PaymentMethod || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">בחר אופן תשלום</option>
              <option value="מזומן">מזומן</option>
              <option value="שיק">שיק</option>
              <option value="אשראי">אשראי</option>
              <option value='הו"ק אשראי'>הו"ק אשראי</option>
              <option value="העברה בנקאית">העברה בנקאית</option>
              <option value='הו"ק בנקאית'>הו"ק בנקאית</option>
              <option value="הבטחה"> הבטחה</option>
              <option value="משולב"> משולב</option>
            </select>
          </label>
          <label>
            הערות:
            <input
              type="text"
              name="Notes"
              value={commitmentForm.Notes || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label>
            תשובה למתרים:
            <input
              type="text"
              name="ResponseToFundraiser"
              value={commitmentForm.ResponseToFundraiser || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label>
            {" "}
            שם קמפיין:
            <input
              type="text"
              name="CampainName"
              value={commitmentForm.CampainName || ""}
              // onChange={handleChange}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200  rounded focus:outline-none"
            />
          </label>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 bg-sky-100 p-4 rounded">
          <button
            type="button"
            onClick={() => AddMemorialDay()}
            className="px-10 bg-blue-500 text-white rounded hover:bg-blue-600 w-[40px] flex items-center justify-center"
          >
            <span >+</span>
          </button>
          <p className="flex items-center">
            סכום מינימום ליום הנצחה:&nbsp;
            <span className="flex items-center">
              {campain.minimumAmountForMemorialDay}
              <BiShekel />
            </span>
          </p>
          <p>
            מספר ימי זכות שנותרו ליום הנצחה:&nbsp;
            <span>
              {Math.floor(
                commitmentForm.CommitmentAmount /
                  campain.minimumAmountForMemorialDay
              ) - commitmentForm.MemorialDays.length}
            </span>
          </p>
        </div>

        <div className="col-span-1 md:col-span-5 grid grid-cols-1 md:grid-cols-5 border border-sky-200 p-2 py-0 border-t-0 rounded-b-md">
          {memorialDaysToDisplay?.length > 0 &&
            memorialDaysToDisplay.map((memorialDay, index) => (
              <div
                key={index}
                className="border border-gray-300 m-2 p-2 rounded relative"
              >
                <button
                  type="button"
                  onClick={() => removeMemorialDay(index)}
                  className="text-red-500 cursor-pointer hover:text-red-700 absolute top-1 left-1"
                >
                  x
                </button>
                <label>
                  יום הנצחה:
                  {commitmentForm.MemorialDays.some((day) =>
                    isTheSameDate(
                      new Date(day.date),
                      new Date(memorialDay.date)
                    )
                  ) ? (
                    ""
                  ) : (
                    <span className="text-red-500 text-sm">
                      {"  "}אנא בחר תאריך הנצחה
                    </span>
                  )}
                  <ReactJewishDatePicker
                    value={
                      commitmentForm.MemorialDays.some((day) =>
                        isTheSameDate(
                          new Date(day.date),
                          new Date(memorialDay.date)
                        )
                      )
                        ? new Date(memorialDay.date)
                        : new Date(campain?.startDate)
                    }
                    onClick={(day) => handleDateChange(index, day)}
                    isHebrew
                    className="mt-2 block w-full p-2 border border-gray-300 rounded bg-gray-200 focus:outline-none"
                    canSelect={(day) => allowedSelectionRange(day)}
                  />
                </label>
                <label>
                  הנצחה:
                  <textarea
                    name="Commeration"
                    value={memorialDay.Commeration || ""}
                    onChange={(e) => handelCommartionChange(index, e)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none"
                    rows="3" // You can adjust the number of rows as needed
                  ></textarea>
                </label>
              </div>
            ))}
        </div>

      </form>
    </div>
  );
}

export default AnashCommitmentDetails;
