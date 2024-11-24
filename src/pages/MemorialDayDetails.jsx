import React, { useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import AddToMemmorialDayTable from "../components/AddToMemmorialDayTable";
import { HDate, gematriya, months } from "@hebcal/hdate";
import {
  AddMemorialDay,
  GetEligblePeopleToMemmorialDay,
  DeleteMemorialDay,
  getUserDetails,
  

} from "../requests/ApiRequests";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function MemorialDayDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const campainName = queryParams.get("CampainName");
  const date = queryParams.get("date");
  const anashidentifier = queryParams.get("anashidentifier");
  const [newAnash, setNewAnash] = useState(anashidentifier);
  const commartion = queryParams.get("commartion")||"";
  const [rowData, setRowData] = useState([]);
  const hebrewDateGematria = new HDate(new Date(date)).renderGematriya()
  const [isLoading, setIsLoading] = useState(false);
  const [personDetails, setPersonDetails] = useState({});
  const [memorialDay, setMemorialDay] = useState({
      Commeration: commartion||"",
      date: new Date(date),
      hebrewDate: hebrewDateGematria
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getUserDetails(newAnash);
        setPersonDetails(res.data.data.userDetails || {});
        console.log(res.data.data.userDetails);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [newAnash]); // Ensure this dependency is correct
  
  




      
  

  useEffect(() => {
    const fetchData = async () => {

      try {
        setIsLoading(true);
        const response = await GetEligblePeopleToMemmorialDay(campainName);
        console.log(response);
        setRowData(response.data.data.people ||[]);
  
      } catch (error) {
        console.error(error);
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  async function deletMemorialDayFunc() 
  {
    try
    {
      setIsLoading(true);
      const res = await DeleteMemorialDay(campainName,anashidentifier, memorialDay.date);
      if(res.status === 200)
      {
        console.log(res);

        toast.success("הנצחה נמחקה בהצלחה");
      }
    }
    catch(error)
    {
      console.log(error);
      toast.error("הנצחה לא נמחקה");
    }
    finally
    {
      setIsLoading(false);
    }
  }
  function handelCommartionChange(e)
  {
     const { name, value } = e.target;
     setMemorialDay(prevMemorialDay => ({
       ...prevMemorialDay,
       [name]: value
     }));
  }
  async function AddAndDeleteMemorialDay(newAnash)
  {
    let isDeletionSuccessful = false;
    try
    {
      setIsLoading(true);
      const res =await DeleteMemorialDay(campainName,anashidentifier, memorialDay.date);
      console.log(res);
      if(res.status === 200)
        {
          isDeletionSuccessful = true; // Mark deletion as successful
          
          
          toast.success("הנצחה נמחקה בהצלחה");
      }
      else
      {
      toast.error("הנצחה לא נמחקה");
      return
      
    }
  }
  catch(error)
  {
    console.log(error);
    toast.error("הנצחה לא נמחקה");
    return
    
    
  }
  finally
  {
    setIsLoading(false);
  }
  if(!isDeletionSuccessful)
    return;
  try{
    setIsLoading(true);
    const data = {AnashIdentifier: newAnash, CampainName: campainName, MemorialDay: memorialDay}
    const res =await AddMemorialDay(data);
    if(res.status === 200)
    {
      toast.success("הנצחה נוספה בהצלחה");
      
    }
    else
    {
      toast.error("הנצחה לא נוספה");
      
    }
    // Navigate('/memorial-board');
    
  }
  catch(error)
  {
    console.log(error);
    toast.error("הנצחה לא נוספה");
  }
  finally
  {
    setIsLoading(false);
  }
  
  
}
function setNewAnashFunc(newAnash) {
  setNewAnash(newAnash);
}



if(isLoading)
{
  return <Spinner/>
}

return (
  <div className="flex justify-around w-full mt-10">
      <div>
        {rowData && (
          <AddToMemmorialDayTable
          rowData={rowData}
          onAddMemorialDayToPerson={setNewAnashFunc}
          />
        )}
      </div>
      <div className="flex flex-col gap-[30px]">
        <div>
          <p className="text-2xl border-b-2"> תורם: {personDetails.FirstName}&nbsp; {personDetails.LastName}</p>
          <p className="text-2xl border-b-2">תאריך יום הנצחה:</p>
          <p className="text-3xl border-b-2 font-bold text-blue-500">
            {hebrewDateGematria}
          </p>
        </div>
        <textarea
          placeholder="הנצחה"
          type="textarea"
          name="Commeration"
          value={memorialDay.Commeration||''}
          onChange={(e) => handelCommartionChange(e)}
          className="border border-gray-300 rounded"
          
        ></textarea>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => AddAndDeleteMemorialDay(newAnash)}><p>אשר עריכה </p></button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={deletMemorialDayFunc}><p>הסר יום הנצחה</p></button>
      </div>
    </div>
  );
}

export default MemorialDayDetails;
