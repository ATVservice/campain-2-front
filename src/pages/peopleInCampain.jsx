import React, { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx';
import { Await, useParams } from 'react-router-dom'
import { getCampainPeople, getPeopleNotInCampain, addPersonToCampain, addPeopleToCampain } from '../requests/ApiRequests';
import AddToCampainTable from '../components/AddToCampainTable';
import CampainTable from '../components/CampainTable';
import Modal from 'react-modal';
import { handleFileUpload } from '../components/Utils';

function peopleInCampain() {
  const { campainName } = useParams();
  const [peopleInCampain, setPeopleInCampain] = useState([]);
  const [peopleNotInCampain, setPeopleNotInCampain] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [uploadedData, setUploadedData] = useState([]);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null); // תוצאות ההעלאה
  const [isModalOpen, setIsModalOpen] = useState(false); // פתיחה וסגירת מודל

  const hebrewToEnglishMapping = {
    'מזהה אנש': 'AnashIdentifier'

  };
  const onSearch = (event) => {
    setSearchText(event.target.value);

  };


  useEffect(() => {

    const fetchCampainPeople = async () => {
      try {
        const response = await getCampainPeople(campainName);
        console.log(response);
        setPeopleInCampain(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPeopleNotInCampain = async () => {
      try {
        const response = await getPeopleNotInCampain(campainName);
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
      console.log(campainName);

      await addPersonToCampain({ campainName, AnashIdentifier });
    } catch (error) {
      console.error('Error adding person to campaign:', error);
      setPeopleNotInCampain(prevPeopleNotInCampain => [...prevPeopleNotInCampain, removedPerson]);
      setPeopleInCampain(prevPeopleInCampain => prevPeopleInCampain.filter(person => person.AnashIdentifier !== AnashIdentifier));
    } finally {
      setLoading(false);
    }
  }
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setUploadedData(json);

    };
    reader.readAsArrayBuffer(file);
  };

  async function handelSubmit() {
    fileRef.current.value = null;

    const headers = uploadedData[0];
    const rows = uploadedData;
    const mappedData = rows.slice(1, rows.length).map(row => {
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
      const response = await addPeopleToCampain({ campainName, mappedData });
      console.log(response.data);

      setUploadResults(response.data); // שמירת התוצאות במצב
      setIsModalOpen(true); // פתיחת המודל להצגת התוצאות
    } catch (error) {
      console.log('Error adding people to campaign:', error);
    }
  }
  function closeModal() {
    setIsModalOpen(false); // סגירת המודל
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">ניהול {campainName}</h1>

      <div className="flex items-center mb-6 gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={handleFileUpload}
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
            <CampainTable rowData={peopleInCampain} campainName={campainName} />
          ) : (
            <p className="text-gray-500">אין אנשים בקמפיין כרגע.</p>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">תוצאות העלאה</h2>
          {uploadResults ? (
            <div>
              <p className="text-green-600 mb-2">
                הוספו בהצלחה: {uploadResults.successcount}
              </p>
              <h3 className="text-xl font-semibold mb-2">כישלונות:</h3>
              {uploadResults.failcount.length > 0 ? (
                <ul className="list-disc pl-5">
                  {uploadResults.failcount.map((fail, index) => (
                    <li key={index} className="mb-1">
                      מזהה אנש: <span className="font-semibold">{fail.AnashIdentifier}</span>,
                      סיבה: <span className="text-red-500">{fail.reason}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">אין כישלונות.</p>
              )}
            </div>
          ) : (
            <p>לא התקבלו תוצאות העלאה.</p>
          )}
          <button
            onClick={closeModal}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            סגור
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default peopleInCampain;