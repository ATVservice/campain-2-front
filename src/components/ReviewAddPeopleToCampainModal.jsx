import React, { useState } from 'react';

function ReviewAddPeopleToCampainModal({ onUploadPeople, validPeople, invalidPeople, onClose }) {
    const hebrewToEnglishMapping = {
        "מזהה אנש": "AnashIdentifier",
        'שם': "FirstName",
        'משפחה': "LastName",
      };
      const [showValidPeople, setShowValidPeople] = useState(()=> validPeople.length > 0);
      const [peopleToDisplay, setPeopleToDisplay] = useState(showValidPeople ? validPeople : invalidPeople);

      function handleChange() {
        setPeopleToDisplay(showValidPeople ? invalidPeople : validPeople);
        setShowValidPeople(!showValidPeople);
      }
      function handelUpload() {
        onUploadPeople();
      }



  return (
    <div>
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center rtl z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-auto max-w-full h-[80vh] flex flex-col relative ">
        {/* Header section */}
        <div className="mb-4">
          <div className="flex justify-between items-center gap-6">
            <h2 className="text-2xl font-semibold"> תקינים : <span className="text-emerald-500">{validPeople.length}</span></h2>
            <h2 className="text-2xl font-semibold"> לא תקינים: <span className="text-red-500">{invalidPeople.length}</span></h2>
            <h2 className="text-2xl font-semibold">סה"כ : <span className="text-gray-500">{validPeople.length + invalidPeople.length}</span></h2>
            {showValidPeople ? (
              <button
                onClick={() => handleChange()}
                className="font-bold text-lg bg-red-500 text-white rounded hover:bg-red-700 px-4 py-2"
              >
                הצג לא תקינים
              </button>
            ) : (
              <button
                onClick={() => handleChange()}
                className="font-bold text-lg bg-green-500 text-white rounded hover:bg-green-700 px-4 py-2"
              >
                הצג תקינים
              </button>
            )}
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
            >
              <span className="text-2xl">x</span>
            </button>
          </div>
        </div>

        {/* Table container with its own scrollable area */}
        <div className="flex-1 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto h-full">
            <table className="min-w-full table-auto rtl">
              <thead className={`sticky top-0 ${showValidPeople ? 'bg-emerald-300' : 'bg-red-500'}`}>
                <tr>
                  {!showValidPeople && (
                    <th className="py-2 px-4 text-center whitespace-nowrap">סיבה</th>
                  )}
                  <th className="py-2 px-2 text-center whitespace-nowrap">מזהה אנ"ש</th>
                  <th className="py-2 px-2 text-center whitespace-nowrap">שם</th>
                  <th className="py-2 px-2 text-center whitespace-nowrap">משפחה</th>
                </tr>
              </thead>
              <tbody>
                {peopleToDisplay.map((person, index) => (
                  <tr key={index} className="border-t">
                    {!showValidPeople && (
                      <td className="py-2 px-4 text-center">{person.reason || "-"}</td>
                    )}
                    <td className="py-2 px-2 text-center">{person.AnashIdentifier || "-"}</td>
                    <td className="py-2 px-2 text-center">{person.FirstName || "-"}</td>
                    <td className="py-2 px-2 text-center">{person.LastName || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fixed bottom left button */}
       { validPeople?.length > 0 &&<div className="absolute bottom-6 left-6">
          <button
            onClick={handelUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            הוסף  תקינים לקמפיין
          </button>
        </div>}
      </div>
    </div>
  </div>
)
}

export default ReviewAddPeopleToCampainModal