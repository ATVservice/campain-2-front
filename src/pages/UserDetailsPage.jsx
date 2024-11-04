import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails, upadateUserDetails,deleteUser } from '../requests/ApiRequests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import RecordOperation from '../components/RecordOperation';

Modal.setAppElement('#root'); // This is important for accessibility

function UserDetailsPage() {
  const { AnashIdentifier } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const openModal = (e) =>
    {

      e.preventDefault();

      setIsModalOpen(true);

    } 
  const closeModal = (e) =>
  {

    e.preventDefault();

    setIsModalOpen(false);
  }

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        console.log(newValue);
      
        setUserDetails({
          ...userDetails,
          [name]: newValue,
        });
      
        setEditedData({
          ...editedData,
          [name]: newValue,
        });
      };
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(Object.keys(editedData).length > 0){
            try {
              setIsLoading(true);
                const userEditedData = {...editedData, AnashIdentifier: userDetails.AnashIdentifier};
                const response = await upadateUserDetails(userEditedData);
                // console.log(response.data.data.updatedUserDetails);
                setUserDetails(response.data.data.updatedUserDetails);
                toast.success('הפרטים נשמרו בהצלחה', {
                  onClose: () => setIsLoading(false)
                });
                console.log(userDetails);

            } catch (error) {
              setIsLoading(false);
                console.error(error);
            }
            finally{
                setEditedData({});
            }
        }

    };

    const handelDeleteUser = async (e) => {
      console.log('e');
        e.preventDefault();
        console.log(isModalOpen);
        try {
          setIsLoading(true);
          await deleteUser(userDetails.AnashIdentifier);
          toast.success('המשתמש נמחק בהצלחה', {
            onClose: () => 
            {
              setIsModalOpen(false);
              navigate('/alfon');
              setIsLoading(false);
            }
          });
        } catch (error) {
          console.error('Failed to delete user:', error.message);
          toast.error('שגיאה במחיקת המשתמש');
          setIsLoading(false);

        
          }
        }
            
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserDetails(AnashIdentifier);
                setUserDetails(response.data.data.userDetails);
                console.log(response.data.data.userDetails);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [AnashIdentifier]);


    function handelShowOperations (e) {
      e.preventDefault();
      setIsRecordModalOpen(true);
    }

    return (
        <>
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
            readOnly
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
        <label>
          פעיל /לא פעיל:
          <input
            type="checkbox"
            name="isActive"
            checked={userDetails.isActive || false}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
      </div>
      <button
        type="submit"
        className="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        אשר עדכון פרטים
      </button>

    <button 
    className="m-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"

    onClick={(e)=>openModal(e)}
    disabled={isLoading}
    >מחק משתמש
    </button> 

    <button
      className="m-4 p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      onClick={handelShowOperations}
      // disabled={isLoading}
    
    >
      היסטוריית פעולות
    </button>
    
    </form>
    {isRecordModalOpen &&(
      <RecordOperation operations={userDetails.Operations} isRecordModalOpen={isRecordModalOpen} setIsRecordModalOpen={setIsRecordModalOpen} />
      
    )
    
  } 
    <Modal
        isOpen={isModalOpen}
        onRequestClose={(e) => closeModal(e)}
        contentLabel="Confirm Deletion"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">אישור מחיקת משתמש</h2>
          <p className="mb-6">האם את/ה בטוח/ה שאת/ה רוצה למחוק משתמש זה?</p>
          <div className="flex justify-end space-x-4 gap-2">
            <button
              onClick={handelDeleteUser}
              disabled={isLoading}
              className={`bg-red-500 text-white font-bold py-2 px-4 rounded ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
              }`}
            >
              {isLoading ? 'Deleting...' : 'כן'}
            </button>
            <button
              onClick={(e) => closeModal(e)}
              disabled={isLoading}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400"
            >
              ביטול
            </button>
          </div>
        </div>
      </Modal>

    
    
    </>
      );
}

export default UserDetailsPage;
  