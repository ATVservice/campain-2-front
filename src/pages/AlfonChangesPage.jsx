

// import { useNavigate ,useLocation } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// // import { ToastContainer, toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';

// function AlfonChangesPage() {
//   const englishToHebrewMapping = {
//     AnashIdentifier: 'מזהה אנש',
//     FullNameForLists: 'שם מלא',
//     FirstName: 'שם',
//     LastName: 'משפחה',
//     FatherName: 'שם האב',
//     PersonID: 'מספר זהות',
//     Address: 'כתובת',
//     addressNumber: 'מספר',
//     floor: 'קומה',
//     zipCode: 'מיקוד',
//     City: 'עיר',
//     MobilePhone: 'נייד 1',
//     MobileHomePhone: 'נייד בבית 1',
//     HomePhone: 'בית 1',
//     Email: 'דוא"ל',
//     BeitMidrash: 'בית מדרש',
//     Classification: 'סיווג',
//     DonationMethod: 'אופן התרמה',
//     fundRaiser: 'מתרים',
//     StudiedInYeshivaYears: 'למד בישיבה בשנים',
//     yashagYear: 'שנה ישיג',
//     CommitteeResponsibility: 'אחראי ועד',
//     PartyGroup: 'קבוצה למסיבה',
//     GroupNumber: 'מספר קבוצה',
//     PartyInviterName: 'שם מזמין למסיבה',
//     isActive: 'פעיל',
//     FreeFieldsToFillAlone: 'שדה חופשי',
//     AnotherFreeFieldToFillAlone: 'שדה חופשי 2',
//     PhoneNotes: 'הערות אלפון',
//   };
//   const location = useLocation();
//   const { data, handelSubmit } = location.state || {}; // Destructure the passed variables
//   console.log(data);


//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [updatedNeedsUpdate, setUpdatedNeedsUpdate] = useState([]);

//   function getDisplayedValue(value) {
//     if (typeof value === 'boolean') {
//       return value ? 'כן' : 'לא';
//     }
//     return value;
//   }

//   const handleSelect = (anashObject) => {
//     console.log(anashObject);
//     setUpdatedNeedsUpdate((prev) => [...prev, anashObject]);
//   };

//   const handleUnselect = (AnashIdentifier) => {
//     setUpdatedNeedsUpdate((prev) =>
//       prev.filter((obj) => obj.AnashIdentifier !== AnashIdentifier)
//     );
//   };

//   const clearAnashArray = () => {
//     setUpdatedNeedsUpdate([]);
//     changeModalState();
//     // Reload the current page by setting the URL again
//   };

//   return (
//     <div>
//       <div className="p-6 flex flex-col gap-4 relative">
//         <div>תורמים חדשים: {data.statusCounts.new}</div>
//         <div>תורמים קיימים: {data.statusCounts.exists}</div>
//         <div>תורמים קיימים עם שינוי בפרטים: {data.statusCounts.needsUpdate}</div>
//         <div>
//           {data.diffs.map((dif, index) => (
//             <div key={index} className="bg-green-200 mb-[50px]">
//               <div className="mb-2">
//                 <span>מזהה אנש: {dif.AnashIdentifier}</span>
//                 <span className="mr-4">שם מלא: {dif.fullName}</span>
//               </div>
//               <div className="flex flex-col gap-2">
//                 {Object.keys(dif.existingPerson).map((key, index) => (
//                   <div key={index} className="flex w-full justify-between">
//                     <span className="bg-blue-200 text-right w-1/2 pr-2">
//                       {englishToHebrewMapping[key]} :{' '}
//                       {getDisplayedValue(dif.existingPerson[key]) || 'ערך לא קיים'}
//                     </span>
//                     <span className="bg-orange-200 text-right w-1/2 pl-2">
//                       {englishToHebrewMapping[key]} :{' '}
//                       {getDisplayedValue(dif.uploadedPerson[key]) || 'ערך לא קיים'}
//                     </span>
//                   </div>
//                 ))}
//                 <div className="flex w-full justify-end mb-2">
//                   <div className="w-1/2 flex justify-start">
//                     {updatedNeedsUpdate.some(
//                       (obj) => obj.AnashIdentifier === dif.AnashIdentifier
//                     ) ? (
//                       <button
//                         onClick={() => handleUnselect(dif.AnashIdentifier)}
//                         className="bg-orange-500 text-white px-4 py-2 rounded w-[150px]"
//                       >
//                         ביטול
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() =>
//                           handleSelect({
//                             ...dif.uploadedPerson,
//                             AnashIdentifier: dif.AnashIdentifier,
//                           })
//                         }
//                         className="bg-red-500 text-white px-4 py-2 rounded w-[150px]"
//                       >
//                         בחירת חדש
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
//           <button
//             onClick={() => {
//               handelSubmit(data.new, data.needsUpdate, updatedNeedsUpdate);
//               changeModalState();
//             }}
//             className="text-blue-500 bg-green-200 px-4 py-2 rounded shadow mr-2"
//           >
//             אישור
//           </button>
//         </div>
//         <div className="absolute top-0 left-0">
//           <button
//             onClick={() => clearAnashArray()}
//             className="text-blue-500 bg-red-200 px-4 py-2 rounded shadow"
//           >
//             X
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AlfonChangesPage;



  

  
  
    




      

  
    
    
    
  

// //   return (
// //     <div>
     

// //   <div className="p-6 flex flex-col gap-4 relative">
// //     <div>
// //       תורמים חדשים: {data.statusCounts.new}
// //     </div>
// //     <div>
// //       תורמים קיימים: {data.statusCounts.exists}
// //     </div>
// //       <div >
// //         תורמים קיימים עם שינוי בפרטים: {data.statusCounts.needsUpdate}
// //       </div>
// //     <div>
// //       {data.diffs.map((dif, index) => (
// //         <div key={index} className="bg-green-200 mb-[50px]">
// //           <div className="mb-2">
// //             <span>מזהה אנש: {dif.AnashIdentifier}</span>
// //             <span className="mr-4">שם מלא: {dif.fullName}</span>
// //           </div >
// //           <div className="flex flex-col gap-2">
// //             {Object.keys(dif.existingPerson).map((key, index) => (
// //               <div key={index} className="flex w-full justify-between">
// //                 <span className="bg-blue-200 text-right w-1/2 pr-2">
// //                   {englishToHebrewMapping[key]} : {getDisplayedvalue(dif.existingPerson[key]) || 'ערך לא קיים'}
// //                 </span>
// //                 <span className="bg-orange-200 text-right w-1/2 pl-2">
// //                   {englishToHebrewMapping[key]} : {getDisplayedvalue(dif.uploadedPerson[key]) || 'ערך לא קיים'}
// //                 </span>
// //               </div>
// //             ))}
// //                   <div className="flex w-full justify-end mb-2">
// //                     <div className="w-1/2 flex justify-start">
// //                       {
                        
// //                         updatedNeedsUpadate.some((obj) => obj.AnashIdentifier === dif.AnashIdentifier) ? (
// //                         <button
// //                           onClick={() => handleUnselect(dif.AnashIdentifier)}
// //                           className="bg-orange-500 text-white px-4 py-2 rounded w-[150px]"
// //                         >
// //                           ביטול
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={() => handleSelect({...dif.uploadedPerson, AnashIdentifier: dif.AnashIdentifier})}
// //                           className="bg-red-500 text-white px-4 py-2 rounded w-[150px]"
// //                         >
// //                           בחירת חדש
// //                         </button>
// //                       )


// //                       }

// //                     </div>
// //                   </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //     <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
// //   <button onClick={() => 
// //     {
// //       handelSubmit(data.new,data.needsUpdate,updatedNeedsUpadate);
// //       changeModalState();
// //     }
// //   } className="text-blue-500 bg-green-200 px-4 py-2 rounded shadow mr-2">
// //     אישור
// //   </button>
// // </div>
// //     <div className="absolute top-0 left-0">
// //       <button onClick={() => clearAnashArray()} className="text-blue-500 bg-red-200 px-4 py-2 rounded shadow">X</button>
// //     </div>
// //   </div>

// //     </div>
// //   )
// // }

// // export default AlfonChanges

      




        