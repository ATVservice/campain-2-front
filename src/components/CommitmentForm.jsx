import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampains } from "../requests/ApiRequests";
import { getUserDetails, getPeople } from "../requests/ApiRequests";
import SearchCommitmmentTable from "./SearchCommitmmentTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CommitmentForm({ onSubmit, onClose }) {
  const [searchText, setSearchText] = useState("");
  function onSelectRow(data) {
    setFormData({
      ...formData,
      AnashIdentifier: data.AnashIdentifier,
      PersonID: data.PersonID,
      FirstName: data.FirstName,
      LastName: data.LastName,
    });
  }
  function onUnselectRow(data) {
    setFormData({
      ...formData,
      AnashIdentifier: "",
      PersonID: "",
      FirstName: "",
      LastName: "",
    });
  }

  const [formData, setFormData] = useState({
    AnashIdentifier: "",
    PersonID: "",
    FirstName: "",
    LastName: "",
    CommitmentAmount: 0,
    AmountPaid: 0,
    AmountRemaining: 0,
    NumberOfPayments: 0,
    PaymentsMade: 0,
    PaymentsRemaining: 0,
    Fundraiser: "",
    PaymentMethod: "",
    Notes: "",
    ResponseToFundraiser: "",
    CampainName: "",
  });

  const [campaigns, setCampaigns] = useState([]);
  const [people, setPeople] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleBlur = async (e) => {
    const AnashIdentifier = e.target.value;

    if (AnashIdentifier) {
      try {
        const response = await getUserDetails(AnashIdentifier);
        console.log(response);

        const { PersonID, FirstName, LastName } =
          response.data.data.userDetails;

        // עדכון state עם הנתונים שהתקבלו
        setFormData((prevData) => ({
          ...prevData,
          PersonID: PersonID || "", // עדכון שדה תעודת זהות
          FirstName: FirstName || "", // עדכון שדה שם פרטי
          LastName: LastName || "", // עדכון שדה שם משפחה
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("שגיאה בקבלת פרטי משתמש");
      }
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  }

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await getCampains();
        setCampaigns(response.data.data.campains); // הנחה שהמידע יושב במערך בשם data
      } catch (error) {
        toast.error("שגיאה בטעינת הקמפיינים");
      }
    };
    const fetchPeople = async () => {
      try {
        const response = await getPeople(true);
        setPeople(response.data.data.people);
      } catch (error) {
        toast.error("שגיאה בטעינת האנשים");
      }
    };

    fetchCampaigns();
    fetchPeople();
  }, []);

  return (
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rtl z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-h-[98vh] z-50">
        <input
          type="text"
          placeholder="חיפוש..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="block w-full mb-4 p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <SearchCommitmmentTable
          rowData={people}
          searchText={searchText}
          onSelectRow={onSelectRow}
          onUnselectRow={onUnselectRow}
        />
        <form className="flex flex-col gap-1 my-4" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <label>אופן התשלום:</label>
            <select
              className="border border-gray-300 rounded-md outline-none"
              name="PaymentMethod"
              value={formData.PaymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">בחר אופן תשלום</option>
              <option value="מזומן">מזומן</option>
              <option value="שיק">שיק</option>
              <option value="אשראי">אשראי</option>
              <option value='הו"ק אשראי'>הו"ק אשראי</option>
              <option value="העברה בנקאית">העברה בנקאית</option>
              <option value='הו"ק בנקאית'>הו"ק בנקאית</option>
            </select>
          </div>
          <div className="flex justify-between">
            <label>קמפיין:</label>
            <select
              className="border border-gray-300 rounded-md outline-none"
              name="CampainName"
              value={formData.CampainName}
              onChange={handleChange}
            >
              <option value="">בחר קמפיין</option>
              {campaigns.map((campaign) => (
                <option key={campaign._id} value={campaign.CampainName}>
                  {campaign.CampainName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between gap-1">
            <label>מזהה אנש:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="text"
              name="AnashIdentifier"
              value={formData.AnashIdentifier}
              onChange={(e) =>
                setFormData({ ...formData, AnashIdentifier: e.target.value })
              }
              required
              readOnly
            />
          </div>

          {/* <div className='flex justify-between'>
                        <label>מספר זהות:</label>
                        <input className="bg-gray-200 outline-none cursor-auto border border-gray-300 rounded-md" type="text" name="PersonID" value={formData.PersonID} onChange={handleChange} readOnly />
                    </div>
                    <div className='flex justify-between'>
                        <label>שם:</label>
                        <input className="bg-gray-200 outline-none cursor-auto border border-gray-300 rounded-md" type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} readOnly />
                    </div>
                    <div className='flex justify-between'>
                        <label>משפחה:</label>
                        <input className="bg-gray-200 outline-none cursor-auto border border-gray-300 rounded-md" type="text" name="LastName" value={formData.LastName} onChange={handleChange} readOnly />
                    </div> */}

          <div className="flex justify-between">
            <label>סכום התחייבות:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="Number"
              name="CommitmentAmount"
              value={formData.CommitmentAmount || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <label>סכום שולם:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="Number"
              name="AmountPaid"
              value={formData.AmountPaid || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <label>סכום שנותר:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="Number"
              name="AmountRemaining"
              value={formData.AmountRemaining || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <label>מספר תשלומים:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="Number"
              name="NumberOfPayments"
              value={formData.NumberOfPayments || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <label>תשלומים שבוצעו:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="Number"
              name="PaymentsMade"
              value={formData.PaymentsMade || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <label>תשלומים שנותרו:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="Number"
              name="PaymentsRemaining"
              value={formData.PaymentsRemaining || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <label>מתרים:</label>
            <input
              className="border border-gray-300 rounded-md outline-none"
              type="text"
              name="Fundraiser"
              value={formData.Fundraiser}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <label>הערות:</label>
            <textarea
              className="border border-gray-300 rounded-md outline-none"
              name="Notes"
              value={formData.Notes}
              onChange={handleChange}
              rows="2"
              id=""
            ></textarea>
          </div>
          <div className="flex justify-between">
            <label>תשובה למתרים:</label>
            <textarea
              className="border border-gray-300 rounded-md outline-none"
              name="ResponseToFundraiser"
              value={formData.ResponseToFundraiser}
              onChange={handleChange}
              rows="2"
              id=""
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              שמור טופס
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommitmentForm;
