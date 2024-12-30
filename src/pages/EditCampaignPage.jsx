import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCampainByName,
  editCampainDetails,
  reviewDeletedMemorialDays,
} from "../requests/ApiRequests"; // Ensure updateCampaign is implemented
import DeletedMemorialDaysModal from "../components/DeletedMemorialDaysModal";
import { HDate, gematriya, months } from "@hebcal/core";
import { ReactJewishDatePicker } from "react-jewish-datepicker";
import "react-jewish-datepicker/dist/index.css";
import HebrewDatePicker from "../components/HebrewDatePicker";
import Spinner from "../components/Spinner";
function EditCampaignPage() {
  let { campainName } = useParams();
  const [campainData, setCampainData] = useState(null); // Original data
  const [editedCampainData, setEditedCampainData] = useState({}); // User-edited data
  const [isLoading, setIsLoading] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [deletedMemorialDays, setDeletedMemorialDays] = useState([]);
  const navigate = useNavigate();
  
  // Fetch campaign details on mount
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getCampainByName(campainName);
        console.log(response);
        const campaign = response.data.data.campain;
        setCampainData(campaign);
        setEditedCampainData(campaign);
      } catch (error) {
        console.log(error);
        toast.error("שגיאה בטעינת נתוני הקמפיין");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaignDetails();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCampainData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleDateChange = (key, day) => {
    console.log("Selected day:", day); // Check the structure of the day object
    setEditedCampainData((prevData) => ({ ...prevData, [key]: day.date }));
    if (key === "startDate") {
      const startHebrewDate = new HDate(new Date(day.date));
      setEditedCampainData((prevData) => ({
        ...prevData,
        hebrewStartDate: startHebrewDate.renderGematriya(),
      }));
    } else if (name === "endDate") {
      const endHebrewDate = new HDate(new Date(day.date));
      setEditedCampainData((prevData) => ({
        ...prevData,
        hebrewEndDate: endHebrewDate.renderGematriya(),
      }));
    }
  };

  // Validate edited data
  const validateData = () => {
    if (!editedCampainData.CampainName) {
      toast.error("שם הקמפיין הוא שדה חובה");
      return false;
    }
    if (
      new Date(editedCampainData.startDate) >=
      new Date(editedCampainData.endDate)
    ) {
      toast.error("תאריך התחלה צריך להיות לפני תאריך סיום");
      return false;
    }
    return true;
  };

  // Save changes
  const handleSave = async () => {
    if (!validateData()) return;

    // Identify changed fields
    const updatedFields = {};
    for (const key in editedCampainData) {
      if (editedCampainData[key] !== campainData[key]) {
        updatedFields[key] = editedCampainData[key];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("אין שינויים לשמור");
      return;
    }

    try {
      setIsLoading(true);
      const response = await reviewDeletedMemorialDays(
        editedCampainData,
        campainData._id
      ); // Backend request
      console.log(response);
      if (response.data.deletedMemorialDays?.length > 0) {
        setDeletedMemorialDays(response.data.deletedMemorialDays);
        setShowDeletedModal(true);
      } else {
        console.log("e");
        console.log(editedCampainData);
      const res2 =  await editCampainDetails(
          editedCampainData,
          deletedMemorialDays,
          campainData._id
        ); // Backend request
        const updatedCampain = res2.data.data.updatedCampaign;
        setCampainData(updatedCampain);
        setEditedCampainData();
        
        navigate(`/campain/${updatedCampain._id}?campainName=${encodeURIComponent(updatedCampain.CampainName)}&minimumAmountForMemorialDay=${updatedCampain.minimumAmountForMemorialDay}`);

        toast.success("השינויים נשמרו בהצלחה");
        console.log(res2);
        
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data?.message||"שגיאה בשמירת השינויים");
    }
    finally {
      setIsLoading(false);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setEditedCampainData(campainData);
    setDeletedMemorialDays([]);
  };
  const handelEditCampainDetailsWithMDays = async () => {
    setDeletedMemorialDays([]);
    setShowDeletedModal(false);
    try {
      setIsLoading(true);
      const response = await editCampainDetails(
        editedCampainData,
        deletedMemorialDays,
        campainData._id
      ); // Backend request
      setCampainData(editedCampainData);
      console.log(response);
      // navigate(`/edit-campaign/${editedCampainData.CampainName}`);
      // navigate(`/campain/${editedCampainData._id}?campainName=${encodeURIComponent(editedCampainData.CampainName)}&minimumAmountForMemorialDay=${campainData.minimumAmountForMemorialDay}`);

      toast.success("השינויים נשמרו בהצלחה");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">
        עריכת קמפיין {campainName}
      </h2>
      {/* <HebrewDatePicker/> */}

      <div className="mb-4">
        <input
          type="text"
          name="CampainName"
          placeholder="שם הקמפיין"
          className="border-2 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          value={editedCampainData.CampainName || ""}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="mb-4 flex flex-col gap-4">
        <div>
        <span className="mb-1 text-blue-700">תאריך התחלה:</span>
        <ReactJewishDatePicker
            key="startDatePicker" // Unique key for the first date picker
            onClick={(day) => handleDateChange("startDate", day)}
            isHebrew
            className="mt-2"
            value={new Date(editedCampainData.startDate)}
          />
        </div>
        <div>
        <span className="mb-1 text-blue-700">תאריך סיום:</span>

          <ReactJewishDatePicker
            key="endDatePicker" // Unique key for the second date picker
            onClick={(day) => handleDateChange("endDate", day)}
            isHebrew
            className="mt-2"
            value={new Date(editedCampainData.endDate)}
          />
        </div>
      </div>

<div className="mb-4">
  <p className="mb-1 text-blue-700">סכום מינימלי ליום הנצחה:</p>
  <input
    type="number"
    name="minimumAmountForMemorialDay"
    className="border-2 p-2 w-full rounded-md bg-gray-200 text-gray-700 focus:outline-none"
    value={editedCampainData.minimumAmountForMemorialDay || ""}
    onChange={handleInputChange}
    readOnly
  />
</div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          שמור שינויים
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          בטל
        </button>
      </div>
      {showDeletedModal && (
        <DeletedMemorialDaysModal
          isOpen={showDeletedModal}
          onClose={() => setShowDeletedModal(false)}
          onSubmit={handelEditCampainDetailsWithMDays}
          deletedMemorialDays={deletedMemorialDays}
        />
      )}
    </div>
  );
}

export default EditCampaignPage;
