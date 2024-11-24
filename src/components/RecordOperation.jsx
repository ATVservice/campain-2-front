import React from 'react'
import Modal from 'react-modal';
import { useState } from 'react';
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
};
const customStyles ={
  content: {
    borderRadius: '10px',
    textAlign: 'right',
    height: 'fit-content',  // Add this line
    maxHeight: '90vh',      // Optional: prevents modal from being too tall
    margin: 'auto',         // Centers the modal vertically
    width: 'fit-content',  // Add this line

  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
}


function RecordOperation({operations,isRecordModalOpen,setIsRecordModalOpen}) {
  console.log('record');

  const openModal = () => setIsRecordModalOpen(true);
  const closeModal = () => setIsRecordModalOpen(false);

  if (!operations || operations.length === 0) {
    return (
      <Modal isOpen={isRecordModalOpen} onRequestClose={closeModal} style={customStyles}>
        <div className="modal-content">
          <h2>אין  היסטוריית פעולות</h2>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={closeModal}>סגור</button>
      </Modal>
    );
  }
  
  function handelOperationDesc (oldValue, newValue) {

    if(oldValue && newValue) {
      return (
       
            Object.keys(oldValue).map((key, index) => (
              <div key={index}>
                <p>ערך ישן, {englishToHebrewMapping[key]||''}: {oldValue[key]}{' '}
            ערך חדש, {englishToHebrewMapping[key]||''}: {newValue[key]}</p>
              </div>
            ))
         
      )
    }
      else if(oldValue) {
        return (
          <span> {oldValue}</span>
        )
      }
      else if(newValue) {
        return (
          <span>{newValue}</span>
        )
      }
      else {
        return null
        
      }
    }
     


  return (
    <div className="App">
      <button onClick={openModal} className="open-modal-button">
        Open Modal
      </button>

      <Modal
        isOpen={isRecordModalOpen}
        onRequestClose={closeModal}
        contentLabel="show history operations"
        style={customStyles}
      >
        <h2 className='text-xl font-semibold border-b border-gray-300 text-blue-500'>היסטוריית פעולות</h2>
          {operations?.length > 0 &&
          (
            <div>
              {operations.map((operation, index) => (
                <div className="border-b border-gray-300 p-2" key={index}>
                 משתמש מערכת: {operation.UserFullName},  תאריך פעולה: {new Date(operation.Date).toLocaleDateString('he-IL')}, סוג פעולה: {operation.OperationType}, 
                    {' '}תיאור פעולה: {handelOperationDesc(operation.OldValue, operation.NewValue)}

                </div>
                
              ))}
            </div>
          )} 
        <button onClick={closeModal} className="close-modal-button mt-4 px-4 py-2 bg-red-500 text-white rounded">
            סגור
          </button>
      </Modal>
    </div>
  );
}

export default RecordOperation