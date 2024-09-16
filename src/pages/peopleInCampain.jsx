import React,{useState,useEffect} from 'react'
import { Await, useParams } from 'react-router-dom'
import { getCampainPeople,getPeople,addPersonToCampain ,addPeopleToCampain,getPeopleNotInCampain,getUserDetails} from '../requests/ApiRequests';
import AddToCampainTable from '../components/AddToCampainTable';
import CampainTable from '../components/CampainTable';
import { handleFileUpload } from '../components/Utils';




function peopleInCampain() {
  const { campainId } = useParams();
  const [peopleInCampain, setPeopleInCampain] = useState([]);
  const [peopleNotInCampain, setPeopleNotInCampain] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [uploadedData, setUploadedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSearch = (event) => {
    setSearchText(event.target.value);
    
  };

  useEffect(() => {

    const fetchCampainPeople = async () => {
      try {
        const response = await getCampainPeople(campainId);
        console.log(response);
        setPeopleInCampain(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPeopleNotInCampain = async () => {
      try {
        const response = await getPeopleNotInCampain(campainId);
        setPeopleNotInCampain(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCampainPeople();
    fetchPeopleNotInCampain();
   
  }, [])
  async function onAddPersonToCampain(AnashIdentifier) {
    setLoading(true);
    let removedPerson;
    try {
      setPeopleNotInCampain(prevPeopleNotInCampain => {
        removedPerson = prevPeopleNotInCampain.find(person => person.AnashIdentifier === AnashIdentifier);
        return prevPeopleNotInCampain.filter(person => person.AnashIdentifier !== AnashIdentifier);
      });
      setPeopleInCampain(prevPeopleInCampain => [...prevPeopleInCampain, removedPerson]);
      await addPersonToCampain({ campainId, AnashIdentifier });
    } catch (error) {
      console.error('Error adding person to campaign:', error);
      setPeopleNotInCampain(prevPeopleNotInCampain => [...prevPeopleNotInCampain, removedPerson]);
      setPeopleInCampain(prevPeopleInCampain => prevPeopleInCampain.filter(person => person.AnashIdentifier !== AnashIdentifier));
    } finally {
      setLoading(false);
    }
  }
    async function handelSubmit() {
}
  
return (
  <div className="p-6 bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-semibold text-center mb-6">ניהול קמפיין</h1>

    <div className="flex items-center mb-6 gap-4">
        <input 
          type="file" 
          onChange={(e) => handleFileUpload(e, (jsonData) => setUploadedData(jsonData))} 
          className="block text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 focus:outline-none hover:bg-gray-200" 
        />
        {uploadedData.length > 0 && (
          <button 
            onClick={handelSubmit} 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            שלח קובץ
          </button>
        )}
      </div>

    <input 
      type="text" 
      placeholder="חיפוש..." 
      value={searchText} 
      onChange={onSearch} 
      className="block w-full mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
    />

    <div className="flex flex-col gap-6">
      {peopleNotInCampain.length > 0 && searchText.length > 1 && (
        <div>
          <h2 className="text-lg font-medium mb-4">הוספת אנשים לקמפיין</h2>
          <AddToCampainTable 
            rowData={peopleNotInCampain} 
            onAddPersonToCampain={onAddPersonToCampain} 
            searchText={searchText} 
          />
        </div>
      )}

      <div>
        <h2 className="text-lg font-medium mb-4">אנשים בקמפיין</h2>
        {peopleInCampain.length > 0 ? (
          <CampainTable rowData={peopleInCampain} />
        ) : (
          <p className="text-gray-500">אין אנשים בקמפיין כרגע.</p>
        )}
      </div>
    </div>
  </div>
);
}

export default peopleInCampain;