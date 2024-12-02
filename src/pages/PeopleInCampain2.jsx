import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import {
  getCampainPeople,
  getPeopleNotInCampain,
  addPersonToCampain,
  reviewBefourAddPeopleToCampain,
  addPeopleToCampain,
  deletePersonFromCampain,
} from "../requests/ApiRequests";
import AddToCampainTable from "../components/AddToCampainTable";
import CampainTable from "../components/CampainTable";
import { toast } from "react-toastify";
import { set } from "date-fns";
import ReviewAddPeopleToCampainModal from "../components/ReviewAddPeopleToCampainModal";
import Spinner from "../components/Spinner";

function PeopleInCampain2() {
  const { campainName } = useParams();
  const [peopleInCampain, setPeopleInCampain] = useState([]);
  const [peopleNotInCampain, setPeopleNotInCampain] = useState([]);
  const [searchNotText, setSearchNotText] = useState("");
  const [searchInText, setSearchInText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileRef = useRef(null);
  const hebrewToEnglishMapping = {
    "מזהה אנש": "AnashIdentifier",
    שם: "FirstName",
    משפחה: "LastName",
  };
  const [validPeople, setValidPeople] = useState([]);
  const [invalidPeople, setInvalidPeople] = useState([]);
  const fetchCampainPeople = async () => {
    try {
      setLoading(true);
      const response = await getCampainPeople(campainName);
      setPeopleInCampain(response.data);
    } catch (error) {
      console.error("Error fetching campaign people:", error);
    }
    finally {
      setLoading(false);
    }
  };
  
  const fetchPeopleNotInCampain = async () => {
    try {
      console.log(campainName);
      const response = await getPeopleNotInCampain(campainName);
      console.log(response);
      setPeopleNotInCampain(response.data);
    } catch (error) {
      console.error("Error fetching people not in campaign:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try
      {
        const response = await fetchPeopleNotInCampain();
        console.log('e');
        await fetchCampainPeople();
        console.log(response);
        
      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []); // Dependency array ensures this runs only once
    const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      json = json.filter((row) =>
        row.some((cell) => cell !== null && cell !== undefined && cell !== "")
      );
      if (!json || json.length === 0 || json.length === 1) {
        toast.error("אין נתונים בקובץ");
        return;
      }

      fileRef.current.value = null;
      const headers = json[0];
      const rows = json.slice(1, json.length);
      const mappedData = rows.map((row) => {
        const mappedRow = {};
        headers.forEach((header, index) => {
          const englishKey = hebrewToEnglishMapping[header];
          if (englishKey) {
            mappedRow[englishKey] = row[index];
          }
        });
        return mappedRow;
      });

      try {
        const response = await reviewBefourAddPeopleToCampain(
          campainName,
          mappedData
        );
        console.log(response.data);
        setValidPeople(response.data.validPeopleToAdd);
        setInvalidPeople(response.data.invalidPeopleToAdd);

        console.log(response.data);
      } catch (error) {
        console.error(error);
        toast.error("שגיאה בהעלאת נתונים");
      }
    };
    reader.readAsArrayBuffer(file);
  };
  const UploadPeopleToCampain = async () => {
    try {
      setLoading(true);
      const response = await addPeopleToCampain(campainName, validPeople);
      if (response.status === 200) {
        console.log(response.data);
        fetchPeopleNotInCampain()
        fetchCampainPeople();
        toast.success("נוספו אנשים לקמפיין בהצלחה");
      } else {
        throw new Error("Failed to add people to the campaign");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "שגיאה בהעלאת נתונים");
    } finally {
      setIsModalOpen(false);
      setValidPeople([]);
      setInvalidPeople([]);
      setLoading(false);
    }
  };
  async function onAddPersonToCampain(AnashIdentifier) {
    try {
      setLoading(true);
      await addPersonToCampain({ campainName, AnashIdentifier });
       fetchCampainPeople();
       fetchPeopleNotInCampain();
      toast.success("תורם נוסף לקמפיין בהצלחה");
    } catch (error) {
      console.error("Error adding person to campaign:", error);
      toast.error("שגיאה בהוספה לקמפיין"); 
    } finally {
      setLoading(false);
    }
  }
  async function onDeletePersonFromCampain(AnashIdentifier) {
    try {
      setLoading(true);
      await deletePersonFromCampain({ campainName, AnashIdentifier });
      await fetchCampainPeople();
      await fetchPeopleNotInCampain();
      toast.success("תורם הוסר מהקמפיין בהצלחה");
    } catch (error) {
      console.error("Error deleting person from campaign:", error);
    } finally {
      setLoading(false);
    }
  }
    if(loading)
    return <Spinner />

  return (
    <div className="flex flex-col gap-6 p-4 pr-10">
      <div className="flex items-center mb-6 gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      <button
        className=" bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 rounded w-[200px] flex items-center justify-center absolute left-1/2 transform -translate-x-1/2"
        onClick={() => fileRef.current && fileRef.current.click()}
      >
        העלאת קובץ
      </button>
      
      <input
        type="text"
        placeholder="חיפוש אנשים להוספה לקמפיין"
        value={searchNotText}
        onChange={(e) => setSearchNotText(e.target.value)}
        className="block w-full mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-sky-100 max-w-fit"
      />
      {peopleNotInCampain?.length > 0 && searchNotText?.length > 1 && (
        <div>
          <h2 className="text-lg font-medium mb-4">הוספת אנשים לקמפיין</h2>
          <AddToCampainTable
            rowData={peopleNotInCampain}
            onAddPersonToCampain={onAddPersonToCampain}
            searchText={searchNotText}
          />
        </div>
      )}
{(validPeople?.length > 0 || invalidPeople?.length > 0) && (
  <ReviewAddPeopleToCampainModal
    onUploadPeople={UploadPeopleToCampain}
    validPeople={validPeople}
    invalidPeople={invalidPeople}
    onClose={() => {
      setValidPeople([]);
      setInvalidPeople([]);
    }}
  />
)}
      <div>
        <input
          type="text"
          placeholder="חיפוש אנשים בקמפיין"
          value={searchInText}
          onChange={(e) => setSearchInText(e.target.value)}
          className="block w-full mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 max-w-fit"
        />

        <h2 className="text-lg font-medium mb-4 border-b inline-block">אנשים בקמפיין</h2>
        {peopleInCampain?.length > 0 ? (
          <CampainTable
            rowData={peopleInCampain}
            onDeletePersonFromCampain={onDeletePersonFromCampain}
            searchInText={searchInText}
          />
        ) : (
          <p className="text-gray-500">אין אנשים בקמפיין כרגע.</p>
        )}
      </div>
    </div>
  );
}

export default PeopleInCampain2;
