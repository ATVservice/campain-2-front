import React from 'react'
import Modal from 'react-modal';
import { useState } from 'react';
import { set } from 'date-fns';
import { json } from 'react-router-dom';
const englishToHebrewMapping = {
  'AnashIdentifier': 'מזהה אנש',
  'FullNameForLists': 'שם מלא',
  'FirstName': 'שם',
  'LastName': 'משפחה',
  'FatherName': 'שם האב',
  'PersonID': 'מספר זהות',
  'Address': 'כתובת',
  'AddressNumber': 'מספר',
  'floor': 'קומה',
  'zipCode': 'מיקוד',
  'City': 'עיר',
  'MobilePhone': 'נייד 1 ',
  'MobileHomePhone': 'נייד בבית 1',
  'HomePhone': 'בית 1',
  'Email': 'דוא"ל',
  'BeitMidrash': 'בית מדרש',
  'Classification': 'סיווג',
  'DonationMethod': 'אופן התרמה',
  'fundRaiser': 'מתרים',
  'StudiedInYeshivaYears': 'למד בישיבה בשנים',
  'yashagYear': 'שנה ישיג',
  'CommitteeResponsibility': 'אחראי ועד',
  'PartyGroup': 'קבוצה למסיבה',
  'GroupNumber': 'מספר קבוצה',
  'PartyInviterName': 'שם מזמין למסיבה',
  'isActive': 'פעיל לא פעיל',
  'FreeFieldsToFillAlone': 'שדה חופשי',
  'AnotherFreeFieldToFillAlone': 'שדה חופשי 2',
  'PhoneNotes': 'הערות אלפון',
  "CommitmentAmount": "סכום התחייבות",
  "AmountPaid": "סכום שולם",
  "AmountRemaining": "סכום שנותר",
  "NumberOfPayments": "מספר תשלומים",
  "PaymentsMade": "תשלומים שבוצעו",
  "PaymentsRemaining": "תשלומים שנותרו",
  "Fundraiser": "מתרים",
  "PaymentMethod": ["מותג", "תנועה", "אופן תשלום"],
  "ResponseToFundraiser": "תשובה למתרים",
  "MemorialDay": "יום הנצחה",
  "Commemoration": "הנצחה",
  "CommitmentId": "מספר התחייבות",
  "Amount": "סכום",
  "Date": "תאריך",
  "CampainName": 'שם קמפיין',
  "Notes": "הערות",
  'MemorialDays':'ימי הנצחה'


};



function RecordOperation({ userDetails, isRecordModalOpen, setIsRecordModalOpen }) {

  const openModal = () => setIsRecordModalOpen(true);
  const closeModal = () => setIsRecordModalOpen(false);

  const [allHistory, setAllHistory] = useState(() => getHistoryToShowSortedByDate((userDetails?.CommitmentsOperations || []).concat(userDetails?.PaymentsOperations || []).concat(userDetails?.AlfonOperations || [])));
  const [historyToShow, setHistoryToShow] = useState(allHistory);
  const [categoriesToShow, setCategoriesToShow] = useState(['CommitmentsOperations', 'PaymentsOperations', 'AlfonOperations']);
  const [categoriesToShowMap, setCategoriesToShowMap] = useState({ CommitmentsOperations: userDetails?.CommitmentsOperations, PaymentsOperations: userDetails?.PaymentsOperations, AlfonOperations: userDetails?.AlfonOperations });



  function getHistoryToShowSortedByDate(history) {
    if (history?.length === 0) return null
    return history.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return dateB - dateA; // Sort in descending order
    });
  }

  if (!userDetails || (userDetails.CommitmentsOperations?.length === 0 && userDetails.PaymentsOperations?.length === 0 && userDetails.AlfonOperations?.length === 0)) {
    return (
      <Modal isOpen={isRecordModalOpen} onRequestClose={closeModal} className='fixed inset-0 flex items-center justify-center'>
        <div >
          <h2>אין  היסטוריית פעולות</h2>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={closeModal}>סגור</button>
      </Modal>
    );
  }

  function handelEditDetails(oldValues, newValues, Desc) {
    if (oldValues && newValues) {
      return Object.keys(oldValues).map((key, index) => {
        const oldItem = oldValues[key];
        const newItem = newValues[key];

        // Handle arrays specifically for MemorialDays
        if ((Array.isArray(oldItem) && key === 'MemorialDays' && oldItem.length == 0) && (Array.isArray(newItem) && key === 'MemorialDays' && newItem.length == 0)) 
          return null
        
        if ((Array.isArray(oldItem) && key === 'MemorialDays' && oldItem.length > 0) || (Array.isArray(newItem) && key === 'MemorialDays' && newItem.length > 0)) {
          return (
            <div key={index}>
              {oldItem.length > 0 ? <p className='text-red-800'>תאריכי יום הנצחה קודמים</p> : <p className='text-red-800'>ערך קודם: ללא תאריכי יום הנצחה</p>}
              {oldItem.map((item, subIndex) => (
                <div key={`${index}-old-${subIndex}`}>
                  <span className="text-red-800">
                    {`תאריך יום הנצחה: ${item?.hebrewDate || 'ללא ערך'}`}
                  </span>
                </div>
              ))}
              {newItem.length > 0 ? <p className='text-green-800'>תאריכי יום הנצחה מעודכנים</p> :  <p className='text-green-800'>ערך עדכני: ללא תאריכי יום הנצחה</p>}
              {Array.isArray(newItem) &&
                newItem.map((item, subIndex) => (
                  <div key={`${index}-new-${subIndex}`}>
                    <span className="text-green-800">
                      {`תאריך יום הנצחה: ${item?.hebrewDate || 'ללא ערך'}`}
                    </span>
                  </div>
                ))}
            </div>
          );
        }


        return (
          <div key={index}>
            <span className="text-red-800">
              ערך ישן, {englishToHebrewMapping[key] || ''}: {renderValue(oldItem) || 'ללא ערך'}{' '}
            </span>
            {' > '}
            <span className="text-green-800">
              ערך חדש, {englishToHebrewMapping[key] || ''}: {renderValue(newItem) || 'ללא ערך'}
            </span>
          </div>
        );

      });

      // Handle other keys
    }

    return null;
  }

  // Helper function to render different types of values
  function renderValue(value) {
    console.log(value);
    if (value === null || value === undefined) return 'ללא ערך'; // Handle null or undefined
    <p>{`תאריך יום הנצחה: ${value.hebrewDate && value.hebrewDate}`}</p>
    return value; // Render strings, numbers, etc.
  }







  function handleCategoryChange(event) {
    const { value, checked } = event.target;

    if (checked) {
      // Add the selected category to the list of categories to show
      setCategoriesToShow((prevCategories) => {
        const updatedCategories = [...prevCategories, value];
        // Concatenate the new category's data and sort the combined history
        const currentHistoryToShow = updatedCategories.flatMap((category) => categoriesToShowMap[category] || []);
        setHistoryToShow(getHistoryToShowSortedByDate(currentHistoryToShow));
        return updatedCategories;
      });
    } else {
      // Remove the unchecked category from the list of categories to show
      setCategoriesToShow((prevCategories) => {
        const updatedCategories = prevCategories.filter((category) => category !== value);
        // Concatenate only the remaining categories and sort
        const currentHistoryToShow = updatedCategories.flatMap((category) => categoriesToShowMap[category] || []);
        setHistoryToShow(getHistoryToShowSortedByDate(currentHistoryToShow) || []);
        return updatedCategories;
      });
    }
  }


  return (
    <div className="record-modal">
      <button onClick={openModal} className="open-modal-button">
        Open Modal
      </button>

      <Modal
        isOpen={isRecordModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg w-full max-w-[98vw]  max-h-[90vh] flex flex-col h-[90vh] w-[90vw]">
          <h2 className='text-xl font-semibold p-4 border-b border-gray-300 text-blue-500'>
            היסטוריית פעולות
          </h2>
          <div className='flex justify-start gap-4 p-4'>
            <div>
              <label htmlFor="AlfonOperations" className="text-gray-600">אלפון</label>
              <input type="checkbox" name="AlfonOperations" id="AlfonOperations" value="AlfonOperations" checked={categoriesToShow.includes('AlfonOperations')} onChange={handleCategoryChange} className="mr-2" />
            </div>
            <div>
              <label htmlFor="CommitmentsOperations" className="text-gray-600"> התחייבויות</label>
              <input type="checkbox" name="CommitmentsOperations" id="CommitmentsOperations" value="CommitmentsOperations" checked={categoriesToShow.includes('CommitmentsOperations')} onChange={handleCategoryChange} className="mr-2" />
            </div>
            <div>
              <label htmlFor="PaymentsOperations" className="text-gray-600">תשלומים</label>
              <input type="checkbox" name="PaymentsOperations" id="PaymentsOperations" value="PaymentsOperations" checked={categoriesToShow.includes('PaymentsOperations')} onChange={handleCategoryChange} className="mr-2" />
            </div>

          </div>

          <div className=" overflow-auto p-4">
            {historyToShow.map((operation, index) => (
              <div className="border-b border-gray-300 pb-2 last:border-b-0" key={index}>
                משתמש מערכת: {operation.UserFullName},
                תאריך פעולה: {new Date(operation.Date).toLocaleDateString('he-IL')},
                סוג פעולה: {operation.OperationType},
                תיאור פעולה: {operation.Desc}
                {operation.OperationType === 'עריכה' && handelEditDetails(operation.Data.OldValue, operation.Data.NewValue, operation.Desc)}
              </div>
            ))}
          </div>

          <div className='p-4 border-t border-gray-300'>
            <button
              onClick={closeModal}
              className="w-[fit-content] px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RecordOperation