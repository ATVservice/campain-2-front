import React from 'react'
import { useState } from 'react'
import { addPerson } from '../requests/ApiRequests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddPersonPage() {
    const [userDetails, setUserDetails] = useState({
      });
        const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;
        console.log(name, value);
        setUserDetails({ ...userDetails, [name]: value });


        
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (Object.keys(userDetails).length > 0) {
            try {
                setIsLoading(true);
                const response = addPerson(userDetails);
                console.log(response);
                toast.success('הוספה בוצעה בהצלחה', {
                    onClose: () => setIsLoading(false)
                });
                console.log(userDetails);
            } catch (error) {
                console.error(error);
            }

        }
    }

  return (
    <div>
        <ToastContainer autoClose={500} />

        <form className="max-w-7xl mx-auto p-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px]">
        <label>
          מזהה אנש:
          <input
            type="text"
            name="AnashIdentifier"
            value={userDetails.AnashIdentifier || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          שם מלא:
          <input
            type="text"
            name="FullNameForLists"
            value={userDetails.FullNameForLists || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          שם:
          <input
            type="text"
            name="FirstName"
            value={userDetails.FirstName || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          משפחה:
          <input
            type="text"
            name="LastName"
            value={userDetails.LastName || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          שם האב:
          <input
            type="text"
            name="FatherName"
            value={userDetails.FatherName || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          מספר זהות:
          <input
            type="text"
            name="PersonID"
            value={userDetails.PersonID || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          כתובת:
          <input
            type="text"
            name="Address"
            value={userDetails.Address || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          מספר:
          <input
            type="text"
            name="adressNumber"
            value={userDetails.adressNumber || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          קומה:
          <input
            type="text"
            name="floor"
            value={userDetails.floor || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          מיקוד:
          <input
            type="text"
            name="zipCode"
            value={userDetails.zipCode || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          עיר:
          <input
            type="text"
            name="City"
            value={userDetails.City || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          נייד 1:
          <input
            type="text"
            name="MobilePhone"
            value={userDetails.MobilePhone || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          נייד בבית 1:
          <input
            type="text"
            name="MobileHomePhone"
            value={userDetails.MobileHomePhone || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          בית 1:
          <input
            type="text"
            name="HomePhone"
            value={userDetails.HomePhone || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          דוא"ל:
          <input
            type="email"
            name="Email"
            value={userDetails.Email || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required = {false}
          />
        </label>
        <label>
          בית מדרש:
          <input
            type="text"
            name="BeitMidrash"
            value={userDetails.BeitMidrash || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          סיווג:
          <input
            type="text"
            name="Classification"
            value={userDetails.Classification || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          אופן התרמה:
          <input
            type="text"
            name="DonationMethod"
            value={userDetails.DonationMethod || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          מתרים:
          <input
            type="text"
            name="fundRaiser"
            value={userDetails.fundRaiser || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          למד בישיבה בשנים:
          <input
            type="text"
            name="StudiedInYeshivaYears"
            value={userDetails.StudiedInYeshivaYears || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          שנה ישיג:
          <input
            type="text"
            name="yashagYear"
            value={userDetails.yashagYear || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          אחראי ועד:
          <input
            type="text"
            name="CommitteeResponsibility"
            value={userDetails.CommitteeResponsibility || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          קבוצה למסיבה:
          <input
            type="text"
            name="PartyGroup"
            value={userDetails.PartyGroup || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          מספר קבוצה:
          <input
            type="text"
            name="GroupNumber"
            value={userDetails.GroupNumber || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          שם מזמין למסיבה:
          <input
            type="text"
            name="PartyInviterName"
            value={userDetails.PartyInviterName || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          שדה חופשי:
          <input
            type="text"
            name="FreeFieldsToFillAlone"
            value={userDetails.FreeFieldsToFillAlone || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          שדה חופשי 2:
          <input
            type="text"
            name="AnotherFreeFieldToFillAlone"
            value={userDetails.AnotherFreeFieldToFillAlone || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label>
          הערות אלפון:
          <input
            type="text"
            name="PhoneNotes"
            value={userDetails.PhoneNotes || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
  
      </div>
    
    </form> 
    <div>
        <button className="action-button add border-2 p-1 w-[100px] bg-slate-300" onClick={handleSubmit}>אישור</button>
    </div>
    </div>
  )
}

export default AddPersonPage