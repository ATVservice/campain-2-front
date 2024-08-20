import React,{useState,useEffect} from 'react'
import { Await, useParams } from 'react-router-dom'
import { getCampainPeople,getPeople,addPersonToCampain } from '../requests/ApiRequests';
import AddToCampainTable from '../components/AddToCampainTable';
import CampainTable from '../components/CampainTable';




function CampainPage() {
  const { campainId } = useParams();
  const [people, setPeople] = useState([]);
  const [campainPeople, setCampainPeople] = useState([]);
  const [searchText, setSearchText] = useState('');

  const onSearch = (event) => {
    setSearchText(event.target.value);
    
  };

  useEffect(() => {

    const fetchCampainPeople = async () => {
      try {
        const response = await getCampainPeople(campainId);
        console.log(response);
        setCampainPeople(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPeople = async () => {
      try {
        const response = await getPeople();
        setPeople(response.data.data.people);
        // console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCampainPeople();
    fetchPeople();
   
  }, [])
  async function onAddPersonToCampain(anashIdentifier) {
    try {
      // Assuming campainId is defined or passed to this function somehow
      await addPersonToCampain({ campainId, anashIdentifier });
    } catch (error) {
      console.error('Error adding person to campaign:', error);
    }
  }
  
  return (
    <div>
      <input 
        type="text" 
        placeholder="חיפוש..." 
        value={searchText} 
        onChange={onSearch} 
        className="m-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-sky-100" 

      />

      
        
       <div className='flex flex-col gap-4'>
         {people.length > 0 &&searchText.length > 1 &&
          <AddToCampainTable rowData={people} onAddPersonToCampain={onAddPersonToCampain} searchText={searchText} />}
          <h2>אנשים בקמפיין</h2>

         
        { campainPeople.length > 0 &&<CampainTable rowData={campainPeople} />}
       </div>
    </div>
  );
}

export default CampainPage