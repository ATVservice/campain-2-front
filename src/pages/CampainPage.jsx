import React,{useState,useEffect} from 'react'
import { Await, useParams } from 'react-router-dom'
import { getCampainPeople,getPeople,addPersonToCampain ,addPeopleToCampain,getPeopleNotInCampain,getUserDetails} from '../requests/ApiRequests';
import AddToCampainTable from '../components/AddToCampainTable';
import CampainTable from '../components/CampainTable';
import { handleFileUpload } from '../components/Utils';




function CampainPage() {
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
  async function onAddPersonToCampain(anashIdentifier) {
    setLoading(true);
    let removedPerson;
    try {
      setPeopleNotInCampain(prevPeopleNotInCampain => {
        removedPerson = prevPeopleNotInCampain.find(person => person.anashIdentifier === anashIdentifier);
        return prevPeopleNotInCampain.filter(person => person.anashIdentifier !== anashIdentifier);
      });
      setPeopleInCampain(prevPeopleInCampain => [...prevPeopleInCampain, removedPerson]);
      await addPersonToCampain({ campainId, anashIdentifier });
    } catch (error) {
      console.error('Error adding person to campaign:', error);
      setPeopleNotInCampain(prevPeopleNotInCampain => [...prevPeopleNotInCampain, removedPerson]);
      setPeopleInCampain(prevPeopleInCampain => prevPeopleInCampain.filter(person => person.anashIdentifier !== anashIdentifier));
    } finally {
      setLoading(false);
    }
  }
    async function handelSubmit() {
}
  
  return (
    <div>
      <input type="file" onChange={(e) => handleFileUpload(e, (jsonData) => setUploadedData(jsonData))} />
      <div>
        {uploadedData.length > 0 && (
          <div>
            <button onClick={handelSubmit}>Submit</button>
          </div>
        )}
      </div>




      <input 
        type="text" 
        placeholder="חיפוש..." 
        value={searchText} 
        onChange={onSearch} 
        className="m-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-100" 

      />

      
        
       <div className='flex flex-col gap-4'>
         {peopleNotInCampain.length > 0 &&searchText.length > 1 &&
          <AddToCampainTable rowData={peopleNotInCampain} onAddPersonToCampain={onAddPersonToCampain} searchText={searchText} />}
          <h2>אנשים בקמפיין</h2>

         
        { peopleInCampain.length > 0 &&<CampainTable rowData={peopleInCampain} />}
       </div>
    </div>
  );
}

export default CampainPage