import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//import { getCampaignDetails, updateCampaign } from '../requests/ApiRequests';

function EditCampaignPage() {
  const { campainName } = useParams();
  const [campainData, setCampainData] = useState({
    CampainName: '',
    start: '',
    end: '',
    minimumAmountForMemorialDay: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        //const response = await getCampaignDetails(campainName);
        setCampainData(response.data);
      } catch (error) {
        toast.error('שגיאה בטעינת נתוני הקמפיין');
      }
    };
    fetchCampaignDetails();
  }, [campainName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampainData({ ...campainData, [name]: value });
  };

  const handleSave = async () => {
    try {
      //await updateCampaign(campainName, campainData);
      toast.success('השינויים נשמרו בהצלחה');
      navigate(`/campaign/${campainName}`);
    } catch (error) {
      toast.error('שגיאה בשמירת השינויים');
    }
  };

  const handleCancel = () => {
    navigate(`/campaign/${campainName}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">עריכת קמפיין {campainName}</h2>
      
      <div className="mb-4">
        <input
          type="text"
          name="CampainName"
          placeholder="שם הקמפיין"
          className="border-2 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          value={campainData.CampainName}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-4">
        <p className="mb-1 text-blue-700">תאריך התחלה:</p>
        <input
          type="date"
          name="start"
          className="border-2 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          value={campainData.start}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-4">
        <p className="mb-1 text-blue-700">תאריך סיום:</p>
        <input
          type="date"
          name="end"
          className="border-2 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          value={campainData.end}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-4">
        <p className="mb-1 text-blue-700">סכום מינימלי ליום הנצחה:</p>
        <input
          type="number"
          name="minimumAmountForMemorialDay"
          className="border-2 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          value={campainData.minimumAmountForMemorialDay}
          onChange={handleInputChange}
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
    </div>
  );
}

export default EditCampaignPage;
