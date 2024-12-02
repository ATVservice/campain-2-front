import React, { useEffect, useState } from "react";
import SearchFilter from "./SearchFilter";
import { set } from "lodash";

function ReviewAlfonChanges({ conflictsData,validPeople, invalidPeople, onSubmit, onClose,showConflicts,setShowConflicts }) {
  const englishToHebrewMapping = {
    AnashIdentifier: "מזהה אנש",
    FullNameForLists: "שם מלא",
    FirstName: "שם",
    LastName: "משפחה",
    FatherName: "שם האב",
    PersonID: "מספר זהות",
    Address: "כתובת",
    AddressNumber: "מספר",
    floor: "קומה",
    zipCode: "מיקוד",
    City: "עיר",
    MobilePhone: "נייד 1 ",
    MobileHomePhone: "נייד בבית 1",
    HomePhone: "בית 1",
    Email: 'דוא"ל',
    BeitMidrash: "בית מדרש",
    Classification: "סיווג",
    DonationMethod: "אופן התרמה",
    fundRaiser: "מתרים",
    StudiedInYeshivaYears: "למד בישיבה בשנים",
    yashagYear: "שנה ישיג",
    CommitteeResponsibility: "אחראי ועד",
    PartyGroup: "קבוצה למסיבה",
    GroupNumber: "מספר קבוצה",
    PartyInviterName: "שם מזמין למסיבה",
    isActive: "פעיל",
    FreeFieldsToFillAlone: "שדה חופשי",
    AnotherFreeFieldToFillAlone: "שדה חופשי 2",
    PhoneNotes: "הערות אלפון",
    Rank: "דרגה",
  };
  const [chosenDocsMap, setChosenDocsMap] = useState(() =>
    conflictsData.reduce((acc, conflict) => {
      acc[conflict.anash] = conflict.uploaded;
      return acc;
    }, {})
  );
  function isSelectedField(anash, keyField, selectedValue) {
    return chosenDocsMap[anash]?.[keyField] === selectedValue;
  }
  function handelFieldClick(anash, keyField, selectedValue) {
    setChosenDocsMap((prevMap) => ({
      ...prevMap,
      [anash]: {
        ...prevMap[anash],
        [keyField]: selectedValue,
      },
    }));
  }
  function selectDoc(anash, doc) {
    setChosenDocsMap((prevMap) => ({
      ...prevMap,
      [anash]: doc,
    }));
  }
  function handelSubmit() {
    let chosenPeople = [];
  
    console.log(chosenDocsMap);
  
    // Check if chosenDocsMap is a valid object and not empty
    if (chosenDocsMap && Object.keys(chosenDocsMap).length > 0) {
      // Transform the object values and include the key as 'AnashIdentifier'
      chosenPeople = Object.entries(chosenDocsMap).map(([anash, value]) => ({
        ...value,
        AnashIdentifier: anash,
      }));
    }
      
    // Pass the arrays to onSubmit
    onSubmit(chosenPeople, validPeople);
  }
  const [filteredconflictsData, setFilteredconflictsData] = useState(conflictsData);
  const getFilteredConflictedData = (filteredData) => {
    setFilteredconflictsData(filteredData);
  };

  






  const [showValidPeople, setShowValidPeople] = useState(
    () => validPeople.length > 0
  );
  const [peopleToDisplay, setPeopleToDisplay] = useState(
    showValidPeople ? validPeople : invalidPeople
  );
  const togglePeopleDisplay = () => {
    const newPeople = showValidPeople ? invalidPeople : validPeople;
    setPeopleToDisplay(newPeople);
    setFilteredPeople(newPeople);
    setShowValidPeople(prev => !prev);
  };
    

  const [filteredPeople, setFilteredPeople] = useState(peopleToDisplay||[]);
  const getFilteredData = (filteredData) => {
    setFilteredPeople(filteredData);
  };









  if(showConflicts)
  {

  

  return (
    <div className="w-[100vw] h-[100vh] max-h-[100vh] bg-gray-500 bg-opacity-75 z-50 flex flex-col justify-center items-center rtl fixed inset-0 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-fit flex flex-col justify-center items-center rtl min-w-[50vw] max-h-[90vh] relative overflow-hidden min-h-[90vh]">
        <div className="w-[90%] flex justify-start gap-4 p-4 items-start">
          <p className="font-bold  px-2 py-1 rounded border-b-2 border-green-300">תקינים:{validPeople?.length}</p>
          <p className="font-bold  px-2 py-1 rounded border-b-2 border-red-300">לא תקינים:{invalidPeople?.length}</p>
          <p className="font-bold   px-2 py-1 rounded border-b-2 border-yellow-300">קונפליקטים:{conflictsData?.length}</p>
        </div>
        <div className="w-[90%] flex items-center gap-4 p-4">
          <SearchFilter
            data={conflictsData}
            columns = {['FirstName', 'LastName', 'anash']}
            onFilter={getFilteredConflictedData}
            placeholder={'חיפוש לפי שם/משפחה/אנש'}

          />
        </div>


        {/* Scrollable content area with bottom padding */}
        <div className="w-full overflow-y-auto px-8 pb-24 pt-6 space-y-4 flex-1">
          {filteredconflictsData?.map((conflict, conflictIndex) => (
            <div
              key={`conflict-${conflictIndex}`}
              className="w-[80%] mb-4 rounded-md border border-gray-300 p-4 shadow-md"
            >
              {/* Header with "anash" */}
              <p className="text-right font-bold mb-4">
                מזהה אנש: {conflict.anash}
                <br />
                 שם פרטי: {conflict.FirstName}
                <br />
                 שם משפחה: {conflict.LastName}
              </p>

              {/* Rows for conflicting fields */}
              <div className="flex justify-between pr-4">
                <p className="text-center font-bold w-1/2">ערך ישן</p>
                <p className="text-center font-bold w-1/2">ערך חדש</p>
              </div>

              {Object.keys(conflict.uploaded).map((key, fieldIndex) => (
                <div
                  key={`field-${conflictIndex}-${fieldIndex}`}
                  className="flex justify-between items-center py-2 last:border-none gap-2"
                >
                  {/* Existing Field */}
                  <div className="w-1/2 pr-4 text-right">
                    <button
                      className={`text-sm text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 rounded-sm w-full text-right 
                      ${isSelectedField(conflict.anash, key, conflict.existing[key])
                          ? "border border-blue-300"
                          : ""
                        }`}
                      onClick={() =>
                        handelFieldClick(
                          conflict.anash,
                          key,
                          conflict.existing[key] || ""
                        )
                      }
                    >
                      <p className="pr-2">
                        {englishToHebrewMapping[key]}:{" "}
                        {conflict.existing[key] || "ערך לא קיים"}
                      </p>
                    </button>
                  </div>

                  {/* Uploaded Field */}
                  <div className="w-1/2 pr-4 text-right">
                    <button
                      className={`text-sm text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-sm w-full text-right 
                      ${isSelectedField(conflict.anash, key, conflict.uploaded[key])
                          ? "border border-purple-300"
                          : ""
                        }`}
                      onClick={() =>
                        handelFieldClick(
                          conflict.anash,
                          key,
                          conflict.uploaded[key] || ""
                        )
                      }
                    >
                      <p className="pr-2">
                        {englishToHebrewMapping[key]}:{" "}
                        {conflict.uploaded[key] || "ערך לא קיים"}
                      </p>
                    </button>
                  </div>
                </div>
              ))}

              {/* Select All Buttons */}
              <div className="flex justify-between pr-4 gap-2">
                <button
                  className="text-center w-1/2 bg-blue-200 rounded-sm hover:bg-blue-300 cursor-pointer"
                  onClick={() => selectDoc(conflict.anash, conflict.existing)}
                >
                  בחר הכל ישן
                </button>
                <button
                  className="text-center w-1/2 bg-purple-200 rounded-sm hover:bg-purple-300 cursor-pointer"
                  onClick={() => selectDoc(conflict.anash, conflict.uploaded)}
                >
                  בחר הכל חדש
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Footer */}

        <footer className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 flex justify-between items-center space-x-4">
          <button
            onClick={() => setShowConflicts(!showConflicts)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            הצג תקינים/לא תקינים
          </button>

          <div className="flex space-x-4 gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              ביטול
            </button>
            <button
              onClick={handelSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
               אישור העלאה
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
  else
  {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center rtl z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-auto min-w-[50vw] max-w-full h-[80vh] flex flex-col relative ">
          {/* Header section */}
          <div className="mb-4">
            <div className="flex justify-between items-center gap-6">
              <h2 className="text-2xl font-semibold">
                {" "}
                תקינים :{" "}
                <span className="text-emerald-500">{validPeople.length}</span>
              </h2>
              <h2 className="text-2xl font-semibold">
                {" "}
                לא תקינים:{" "}
                <span className="text-red-500">{invalidPeople.length}</span>
              </h2>
              <h2 className="text-2xl font-semibold">
                קונפליקטים:{" "}
                <span className="text-gray-500">{conflictsData.length}</span>
              </h2>
              {showValidPeople ? (
                <button
                  onClick={() => togglePeopleDisplay()}
                  className="font-bold text-lg bg-red-500 text-white rounded hover:bg-red-700 px-4 py-2"
                >
                  הצג לא תקינים
                </button>
              ) : (
                <button
                  onClick={() => togglePeopleDisplay()}
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
          <SearchFilter
          data={peopleToDisplay}
          columns = {['FirstName', 'LastName', 'AnashIdentifier']}
          onFilter={getFilteredData}
          placeholder={'חיפוש לפי שם/משפחה/אנש'}

        />

  
          {/* Table container with its own scrollable area */}
          <div className="flex-1 overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto h-full">
              <table className="min-w-full table-auto rtl">
                <thead
                  className={`sticky top-0 ${
                    showValidPeople ? "bg-emerald-300" : "bg-red-500"
                  }`}
                >
                  <tr>
                    {!showValidPeople && (
                      <th className="py-2 px-4 text-center whitespace-nowrap">
                        סיבה
                      </th>
                    )}
                    <th className="py-2 px-2 text-center whitespace-nowrap">
                      מזהה אנ"ש
                    </th>
                    <th className="py-2 px-2 text-center whitespace-nowrap">
                      שם
                    </th>
                    <th className="py-2 px-2 text-center whitespace-nowrap">
                      משפחה
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeople.map((person, index) => (
                    <tr key={index} className="border-t">
                      {!showValidPeople && (
                        <td className="py-2 px-4 text-center">
                          {person.reason || "-"}
                        </td>
                      )}
                      <td className="py-2 px-2 text-center">
                        {person.AnashIdentifier || "-"}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {person.FirstName || "-"}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {person.LastName || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
          <button onClick={() => setShowConflicts(!showConflicts)}
            className="px-4 py-2 bg-green-500 text-white text-center rounded hover:bg-green-600  w-1/3">
            <p>הצג קונפליקטים</p>
          </button>
          {/* Fixed bottom left button */}
          {(validPeople.length > 0 || conflictsData.length > 0) && (
            <div className="absolute bottom-6 left-6">
              <button
                onClick={handelSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                אשר העלאה
              </button>
            </div>
          )}
        </div>
      </div>
    );
  
  }



















}

export default ReviewAlfonChanges;
