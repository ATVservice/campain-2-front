import React from 'react'
import {useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { addPerson } from '../requests/ApiRequests';
import { toast , ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';


function AddPersonPage() {
  const [userDetails, setUserDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, validity, title } = e.target;

    setUserDetails({ ...userDetails, [name]: value });

    // If the input is invalid, set an error message
    if (!validity.valid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: title,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    console.log('e');
    e.preventDefault();
    console.log(userDetails);

    try {
      setIsLoading(true);
      const response = await addPerson(userDetails); // Add await if addPerson is an async function
      console.log(response);
      toast.success('הוספה בוצעה בהצלחה', {
        onClose: () => setIsLoading(false),
      });
      setTimeout(() => {
        navigate('/alfon');
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while submitting the form');
      setIsLoading(false); // Ensure loading is stopped in case of an error
    }
  };
  if(isLoading){
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* <ToastContainer autoClose={500} /> */}

      <form className="max-w-7xl mx-auto p-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px]">
          <label className='border-red-500'>
            מזהה אנש <span className="text-red-500">*</span>
            <input
              type="text"
              name="AnashIdentifier"
              value={userDetails.AnashIdentifier || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="\d+"
              title="מזהה אנש חייב להיות רק מספרים"
              required
            />
            {errors.AnashIdentifier && (
              <span className="text-red-500 text-sm">{errors.AnashIdentifier}</span>
            )}
          </label>
          <label>
            שם מלא:
            <input
              type="text"
              name="FullNameForLists"
              value={userDetails.FullNameForLists || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="[א-תA-Za-z ']+"
              title="שם מלא חייב להכיל רק אותיות "
            />
            {errors.FullNameForLists && (
              <span className="text-red-500 text-sm">{errors.FullNameForLists}</span>
            )}
          </label>
          <label>
            שם<span className="text-red-500">*</span>
            <input
              type="text"
              name="FirstName"
              value={userDetails.FirstName || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="[א-תA-Za-z ']+"
              title="שם חייב להכיל רק אותיות "
              required
            />
            {errors.FirstName && (
              <span className="text-red-500 text-sm">{errors.FirstName}</span>
            )}

          </label>
          <label>
            משפחה  <span className="text-red-500">*</span>
            <input
              type="text"
              name="LastName"
              value={userDetails.LastName || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="[א-תA-Za-z ']+"
              title="שם משפחה חייב להכיל רק אותיות "
              required
            />
            {errors.LastName && (
              <span className="text-red-500 text-sm">{errors.LastName}</span>
            )}
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
              pattern="\d+"
              title="מספר זהות חייב להיות רק מספרים"
            />
            {errors.PersonID && (
              <span className="text-red-500 text-sm">{errors.PersonID}</span>
            )}

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
              name="AddressNumber"
              value={userDetails.AddressNumber || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="\d+"
              title="מספר חייב להיות רק מספרים"

            />
            {errors.AddressNumber && (
              <span className="text-red-500 text-sm">{errors.AddressNumber}</span>
            )}

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
              pattern="\d+"
              title="מיקוד חייב להיות רק מספרים"
            />
            {errors.zipCode && (
              <span className="text-red-500 text-sm">{errors.zipCode}</span>
            )}

          </label>
          <label>
            עיר:
            <input
              type="text"
              name="City"
              value={userDetails.City || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="[א-תA-Za-z ']+"

              title="עיר חייבת להכיל רק אותיות "
            />
            {errors.City && (
              <span className="text-red-500 text-sm">{errors.City}</span>
            )}
            {errors.City && (
              <span className="text-red-500 text-sm">{errors.City}</span>
            )}
          </label>
          <label>
            נייד 1:
            <input
              type="tel"
              name="MobilePhone"
              value={userDetails.MobilePhone || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="\d{10}"
              title="מספר נייד חייב להיות 10 ספרות"
            />
            {errors.MobilePhone && (
              <span className="text-red-500 text-sm">{errors.MobilePhone}</span>
            )}

          </label>
          <label>
            נייד בבית 1:
            <input
              type="tel"
              name="MobileHomePhone"
              value={userDetails.MobileHomePhone || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="\d{10}"
              title="מספר נייד בבית חייב להיות 10 ספרות"
            />
            {errors.MobileHomePhone && (
              <span className="text-red-500 text-sm">{errors.MobileHomePhone}</span>
            )}
          </label>
          <label>
            בית 1:
            <input
              type="tel"
              name="HomePhone"
              value={userDetails.HomePhone || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="\d{9}"
              title="מספר בית חייב להיות 9 ספרות"
            />
            {errors.HomePhone && (
              <span className="text-red-500 text-sm">{errors.HomePhone}</span>
            )}
          </label>
          <label>
            דוא"ל:
            <input
              type="email"
              name="Email"
              value={userDetails.Email || ''}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
            />
            {errors.Email && (
              <span className="text-red-500 text-sm">{errors.Email}</span>
            )}
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

        <div>
          <button type="submit" className="action-button add border-2 p-1 w-[100px] bg-slate-300 hover:bg-slate-400">אישור</button>
        </div>
      </form>
    </div>
  )
}

export default AddPersonPage