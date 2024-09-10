
import React, { useState ,useEffect} from "react";
import { ReactJewishDatePicker } from "react-jewish-datepicker";
import "react-jewish-datepicker/dist/index.css";
import { dontSelectShabatAndHolidays } from "jewish-dates-core";
import { IoMdAdd } from "react-icons/io";
import { addCampain } from "../requests/ApiRequests";
import { getCampains } from "../requests/ApiRequests";
import { useNavigate } from "react-router-dom";

function CampainsPage() {

  const navigate = useNavigate();
  const [campains, setCampains] = useState([]);
  const [campainData, setCampainData] = useState({
    start: null,
    end: null,
    CampainName: ""
  });
  const [showAddCampainInputs, setShowAddCampainInputs] = useState(false);
  let [message, setmessage] = useState('');
  const excludeShabatAndHolidays = dontSelectShabatAndHolidays();

  const handleDateChange = (key, day) => {
    console.log("Selected day:", day); // Check the structure of the day object
    setCampainData(prevData => ({
      ...prevData,
      [key]: day
    }));
  };

  const handleCampainNameChange = (e) => {
    setCampainData(prevData => ({
      ...prevData,
      CampainName: e.target.value
    }));
  };

  const handleAddCampain = async () => {
    const { start, end, CampainName } = campainData;
    if (!start || !end || !CampainName)
        {
          setmessage('נא למלא את כל השדות')
          return

        } 
        
        await addCampain({ start, end, CampainName });
       

  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCampains();
        setCampains(response.data.data.campains);
        console.log(response.data.data.campains);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div className="p-4">
      <div className="flex gap-4">
        {campains.map((campain) => (
          <button
          onClick={() => navigate(`/campain/${campain._id}`)}
           className="p-1 border border-stone-950	 hover:bg-gray-300" key={campain._id}>{campain.CampainName}</button>
        ))}
      </div>
      <button
        className="text-[30px] bg-gray-200 hover:text-[33px] hover:bg-gray-300 border-1"
        onClick={() => setShowAddCampainInputs(!showAddCampainInputs)}
      >
        <IoMdAdd />
      </button>

      {showAddCampainInputs && (
        <section className="w-[300px] flex flex-col gap-[20px]">
          <div>
            <p>
              תאריך התחלה:{" "}
              {campainData.start
                ? `${campainData.start.jewishDateStrHebrew}`
                : "לא נבחר תאריך"}
            </p>
            <ReactJewishDatePicker
              onClick={(day) => handleDateChange('start', day)}
              isHebrew
              canSelect={excludeShabatAndHolidays}
            />
          </div>

          <div>
            <p>
              תאריך סיום:{" "}
              {campainData.end
                ? `${campainData.end.jewishDateStrHebrew}`
                : "לא נבחר תאריך"}
            </p>
            <ReactJewishDatePicker
              onClick={(day) => handleDateChange('end', day)}
              isHebrew
              canSelect={excludeShabatAndHolidays}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="שם הקמפיין"
              className="border-2 p-1"
              value={campainData.CampainName}
              onChange={handleCampainNameChange}
            />
          </div>

          <button
            className="border-2 p-1 w-[100px] hover:bg-gray-300"
            onClick={handleAddCampain}
          >
            הוסף קמפיין
          </button>
          {message && <p>{message}</p>}
        </section>
      )}
    </div>
  );
}

export default CampainsPage;