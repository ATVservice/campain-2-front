import React, { memo, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import AddToMemmorialDayTable from '../components/AddToMemmorialDayTable';
import { HDate, gematriya, months } from '@hebcal/hdate';
import { getPeopleWithCommitment, getMemorialDayByDate, updateMemorialDay, GetEligblePeopleToMemmorialDay } from '../requests/ApiRequests';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";




function AddMemorialDayToPerson() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);


  const campainName = queryParams.get('CampainName');
  const campainId = queryParams.get('campainId');
  const date = queryParams.get('date');
  const hebrewDateGematria = new HDate(new Date(date)).renderGematriya()

  const [rowData, setRowData] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);


  const [memorialDay, setMemorialDay] = useState({
    campainId: campainId,
    date: new Date(date),
    hebrewDate: hebrewDateGematria,
    types: [],


  })
  const [emptySlots, setEmptySlots] = useState([]);




  const [openIndexes, setOpenIndexes] = useState([]);
  const toggleRow = (index) => {
    setOpenIndexes((prev) =>
     [...prev, index]
    );
  };
  const unToggleRow = (index) => {
    setOpenIndexes((prev) =>
      prev.filter((i) => i !== index)
    );
  };
  


  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await GetEligblePeopleToMemmorialDay(campainName);
        setRowData(response.data?.data?.people || []);
        // setCampainTypes(response.data.data.campain || []);
        const memoDayRes = await getMemorialDayByDate(date);
        setMemorialDay(memoDayRes.data?.types?.length > 0 ? memoDayRes.data : memorialDay);
        const existingTypes = memoDayRes.data?.types?.map(t => t.name) ?? [];
        const notExistingTypes = response.data?.data?.campain?.types?.filter(
          type => !existingTypes.includes(type)
        );
        setEmptySlots([...notExistingTypes]);
    

      } catch (error) {
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  
  
  function handleCommerationChange(e, index) {
    const { value } = e.target;

    setMemorialDay(prev => {
      const updatedTypes = [...prev.types];
      updatedTypes[index] = {
        ...updatedTypes[index],
        Commeration: value
      };

      return {
        ...prev,
        types: updatedTypes
      };
    });
  }

  function handleSelectPerson(person, name) {
    setMemorialDay(prev => {
      const existingIndex = prev.types.findIndex(item => item.name === name);
      const updatedTypes = [...prev.types];

      if (existingIndex !== -1) {
        updatedTypes[existingIndex] = {
          ...updatedTypes[existingIndex],
          person
        };
      }

      return {
        ...prev,
        types: updatedTypes
      };
    });
  }

  function handleUnselectPerson (name) {
    setMemorialDay(prev => {
      const updatedTypes = prev.types.map(item => {
        if (item.name === name) {
          return {
            ...item,
            person: null
          };
        }
        return item;
      });
      return {
        ...prev,
        types: updatedTypes
      };
    });
  }

  function handelDelete(index) {


    setMemorialDay(prev => ({
      ...prev,
      types: prev.types.filter((_, i) => i !== index)
    }));


    setEmptySlots(prev => [...prev, memorialDay.types[index].name]);
  }

  const handleAddType = (name) => {
    setMemorialDay(prev => {
      const updatedTypes = prev.types ? [...prev.types] : [];
      updatedTypes.push({
        name: name,
        person: null,
        Commeration: ''
      });
      
      return {
        ...prev,
        types: updatedTypes
      };
    });
    setEmptySlots(prev => prev.filter(item => item !== name));

  };
 
  async function handleSubmit() {
    // Create a copy where only person._id is kept
    const hasMissingPerson = memorialDay.types.some(type => !type.person);

    if (hasMissingPerson) {
      toast.error("אנא בחר אדם בכל ימי ההנצחה שבחרת");
      return;
    }

    const payload = {
      ...memorialDay,
      types: memorialDay.types.map(type => ({
        ...type,
        person: type.person._id
      }))
    };


    try {
      setIsLoading(true)

      const res = await updateMemorialDay(payload);
      toast.success("עדכון בוצע בהצלחה")
    }
    catch (err) {

    }
    finally {
      setIsLoading(false)


    }


  }



  if (isLoading) {
    return <Spinner />
  }
  // console.log(memorialDay);

  return (
    <div className="p-2 flex flex-col gap-4">
      {/* Empty Slots */}
      <div className="flex gap-[40px]">
        {emptySlots.map((name, index) => (
          <button
            key={index}
            onClick={() => handleAddType(name)}
            className="flex items-center border border-blue-300 gap-2 p-2 rounded-sm hover:bg-blue-100 transition cursor-pointer"
            disabled={isLoading}
          >
            <p className="text-md">
              <span className="text-blue-500 font-bold">סוג:</span> {name}
            </p>
            <IoMdAdd className="text-green-500" />
          </button>
        ))}
      </div>
  
      {/* Assigned Types */}
      <div className="flex flex-wrap gap-4">
      {memorialDay.types?.map((item, index) => {
  const isOpen = openIndexes.includes(index);

  const IconButtons = () => (
    <div className="flex gap-4 w-full text-2xl justify-center">
      {(item.person) &&(
        <button
          onClick={() =>
            {
            handleUnselectPerson(item.name)
            toggleRow(index)
          }
        }
          className="text-blue-500 hover:text-blue-700 font-bold text-1xl bg-blue-100 p-1 rounded flex-1 flex items-center justify-center"
        >
          <FaRegEdit />
        </button>
)}

      {(!item.person&& !openIndexes.includes(index)) && (
        <button
          onClick={() =>
            toggleRow(index)
          }
          className="text-blue-500 hover:text-blue-700 font-bold text-1xl bg-blue-100 p-1 rounded flex-1 flex items-center justify-center"
        >
          <FaRegEdit />
        </button>
      )}
      <button
        onClick={() => 
          {
          handelDelete(index)
          unToggleRow(index)

        }
        }
        className="text-red-500 hover:text-red-700 font-bold text-1xl bg-red-100 p-1 rounded flex-1 flex items-center justify-center"
      >
        <MdDeleteOutline />
      </button>
    </div>
  );
       
  const itemAndName = () => (
    <>
      
      <p className="text-blue-600 font-bold">סוג:</p>
      <p>{item.name}</p>
      {!item.person && <p className="text-red-600 font-bold"> אנא בחר תורם </p>}
    </>

  )


        

       
      
      
  

  
  return (
    <div
      key={index}
      className={`flex flex-col gap-4 bg-sky-100 p-2 rounded-md`}
    >

      {(item.person) && (
        <>
      <div className="text-md flex gap-8" dir="rtl">
        <div className="flex gap-2">
          {itemAndName()}
        <span className="font-bold text-green-600">תורם:</span>{" "}
          {item.person.FirstName} {item.person.LastName}
        </div>
      </div>
            <textarea
              placeholder="הנצחה"
              name="Commeration"
              value={item.Commeration || ""}
              onChange={(e) => handleCommerationChange(e, index)}
              className="border border-gray-300 rounded w-full"
            ></textarea>
        </>
      )
    }
    {
      (!item.person) && (isOpen) && (
        
            <div className='min-w-[500px]'>
              <div className='flex gap-2'>
                {itemAndName()}

              </div>

              <AddToMemmorialDayTable
                typeKey={item.name}
                rowData={rowData}
                handelSelectPerson={handleSelectPerson}
              />
              <textarea
                placeholder="הנצחה"
                name="Commeration"
                value={item.Commeration || ""}
                onChange={(e) => handleCommerationChange(e, index)}
                className="border border-gray-300 rounded w-full"
              ></textarea>
            </div>
      
)
}
    {
      (!item.person) && (!isOpen) && (
        
            <div className=''>
              <div className='flex gap-2'>
                {itemAndName()}

              </div>
            </div>
      
)
}
   
   
      
      

      <IconButtons />
    </div>
  );
})}

      </div>
  
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 border-2 p-1 w-[300px] bg-green-500 mt-2 text-white mb-2 rounded hover:bg-green-600"
      >
        אשר עריכה/הוספה
      </button>
    </div>
  );
  


}

export default AddMemorialDayToPerson



