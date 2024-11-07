import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCommitmentDetails,
  deleteCommitment,
  updateCommitmentDetails,
  uploadCommitmentPayment,
  getCampains,
  deletePayment,
  getCampainByName,
  getAllMemorialDates,
} from "../requests/ApiRequests";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import Modal from "react-modal";
import { ReactJewishDatePicker } from "react-jewish-datepicker";
import "react-jewish-datepicker/dist/index.css";
import {
  dontSelectOutOfRange,
  addDates,
  subtractDates,
} from "jewish-dates-core";
import { set } from "date-fns";
import { BiShekel } from "react-icons/bi";

Modal.setAppElement("#root");

function CommitmentDetailsPage() {
  const { commitmentId } = useParams();
  const navigate = useNavigate();
  const [commitmentDetails, setCommitmentDetails] = useState({});
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // עבור הטופס להוספת תשלום
  const [payments, setPayments] = useState([]);
  const [paymentData, setPaymentData] = useState({
    Amount: "",
    Date: "",
    PaymentMethod: "",
  }); 
  const [MemorialDays, setMemorialDays] = useState([]);
  const [allCampainMemorialDates, setAllCampainMemorialDates] = useState([]);
  const [campain, setCampain] = useState({});
  let [initialMemorialDayLength, setInitialMemorialDayLength] = useState(0);

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    setIsModalOpen(false);
  };
  const openPaymentModal = (e) => {
    e.preventDefault();
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = (e) => {
    setIsPaymentModalOpen(false);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommitmentDetails({
      ...commitmentDetails,
      [name]: value,
    });
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract values for validation
    const commitmentAmount =
      parseFloat(commitmentDetails.CommitmentAmount) || 0;
    const amountPaid = parseFloat(commitmentDetails.AmountPaid) || 0;
    const amountRemaining = parseFloat(commitmentDetails.AmountRemaining) || 0;
    const numberOfPayments =
      parseInt(commitmentDetails.NumberOfPayments, 10) || 0;
    const paymentsMade = parseInt(commitmentDetails.PaymentsMade, 10) || 0;
    const paymentsRemaining =
      parseInt(commitmentDetails.PaymentsRemaining, 10) || 0;

    // Validation checks
    if (amountPaid > commitmentAmount) {
      toast.error("הסכום ששולם לא יכול להיות גדול מסכום ההתחייבות");
      return;
    }

    if (amountRemaining > commitmentAmount) {
      toast.error("הסכום שנותר לתשלום לא יכול להיות גדול מסכום ההתחייבות");
      return;
    }
    if (amountRemaining < 0) {
      toast.error("הסכום שנותר לתשלום לא יכול להיות קטן מ-0");
      return;
    }

    if (paymentsRemaining < 0) {
      toast.error("מספר התשלומים שנותרו לא יכול להיות קטן מ-0");
      return;
    }

    if (paymentsRemaining > numberOfPayments) {
      toast.error("מספר התשלומים שנותרו לא יכול להיות גדול מסך התשלומים");
      return;
    }

    if (paymentsMade > numberOfPayments) {
      toast.error("מספר התשלומים שבוצעו לא יכול להיות גדול מסך התשלומים");
      return;
    }

    if (commitmentAmount - amountPaid !== amountRemaining) {
      toast.error("פרטי סכום התחייבות אינם תקינים.");
      return;
    }

    if (numberOfPayments - paymentsMade !== paymentsRemaining) {
      toast.error("פרטי מספר התשלומים אינם תקינים.");
      return;
    }
    // console.log(MemorialDays.length, initialMemorialDayLength);

    if (Object.keys(editedData).length > 0 || MemorialDays.length > 0 || initialMemorialDayLength != MemorialDays.length) {
      let response = null;
      try {
        setIsLoading(true);
        const MemorialDaysData = MemorialDays.filter((day) => day.date);
        console.log(MemorialDaysData.length);
        const commitmentEditedData = {
          ...editedData,
          commitmentId: commitmentDetails._id,
          MemorialDays: MemorialDaysData,
        };
        console.log(commitmentEditedData);

        response = await updateCommitmentDetails(
          commitmentDetails._id,
          commitmentEditedData
        );
        setCommitmentDetails(response.data.data.updateCommitmentDetails);
        toast.success("הפרטים נשמרו בהצלחה", {
          onClose: () => setIsLoading(false),
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Error updating commitment:", error);
      } finally {
        setEditedData({});
      }
      if (!response.status === 200) return;
      try {
        const res = await GetAllCampainMemorialDates(
          commitmentDetails.CampainName
        );
        if (res.status === 200) {
          setAllCampainMemorialDates(res.data.data.memorialDates);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  async function GetAllCampainMemorialDates(campainName) {
    try {
      const response = await getAllMemorialDates(campainName);
      return response;
      // setFetchMemorialDates(response.data.data.memorialDates);
    } catch (error) {
      console.error("Error fetching memorial dates:", error);
    }
  }

  const handleDelete = async () => {
    if (!commitmentId) {
      console.error("No commitment ID provided.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await deleteCommitment(commitmentId);
      console.log(response);
      if (response.status === 200) {
        toast.success("ההתחייבות נמחקה בהצלחה!");
        setTimeout(() => {
          navigate("/commitment"); // נווט לדף ההתחייבויות לאחר המחיקה
        }, 2000); // עיכוב של 2 שניות לפני הניווט
      } else {
        toast.error("שגיאה במחיקת ההתחייבות");
      }
    } catch (error) {
      toast.error("שגיאה במחיקת ההתחייבות");
      console.error("Error deleting commitment:", error);
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    console.log(commitmentDetails);
    if (!commitmentId) {
      console.error("Commitment ID is missing");
      return;
    }
    console.log(commitmentDetails);

    const paymentAmount = parseFloat(paymentData.Amount);
    const remainingAmount = commitmentDetails.AmountRemaining;
    const paymentsRemaining = commitmentDetails.PaymentsRemaining;
    const AnashIdentifier = commitmentDetails.AnashIdentifier;

    // Validation before proceeding with payment
    if (paymentAmount <= 0) {
      toast.error("הסכום לתשלום חייב להיות גדול מ-0");
      return;
    }
    if (remainingAmount <= 0) {
      toast.error("לא ניתן להוסיף תשלום כשיתרת התשלום היא 0");
      return;
    }
    if (paymentAmount > remainingAmount) {
      toast.error("הסכום לתשלום לא יכול לחרוג מהיתרה לתשלום");
      return;
    }
    if (paymentsRemaining <= 0) {
      toast.error("לא ניתן להוסיף תשלום כשלא נותרו תשלומים");
      return;
    }

    try {
      // If the update was successful, proceed to upload the payment
      const paymentDataWithId = {
        ...paymentData,
        CommitmentId: commitmentId,
        AnashIdentifier: AnashIdentifier, // הוספת מזהה אנש לבקשת התשלום
      };
      const response = await uploadCommitmentPayment(paymentDataWithId);

      if (response && response.status === 200) {
        const updatedCommitmentDetails = await getCommitmentDetails(
          commitmentId
        );
        setCommitmentDetails(updatedCommitmentDetails.data.commitmentDetails);

        toast.success("התשלום עודכן בהצלחה!");
        closePaymentModal();
      } else {
        toast.error("עידכון התשלום נכשל!");
      }
    } catch (error) {
      toast.error("שגיאה בעדכון התשלום");
      console.error("Error saving payment:", error);
    }
  };

  const [campainStartDate, setCampainStartDate] = useState(new Date());
  const [campainEndDate, setCampainEndDate] = useState(new Date());

  useEffect(() => {
    const fetchCommitmentDetails = async () => {
      let commitmentRes = null;
      try {
        commitmentRes = await getCommitmentDetails(commitmentId);
        console.log(commitmentRes);
        if (commitmentRes.data) {
          const { commitmentDetails, payments } = commitmentRes.data;
          setCommitmentDetails(commitmentDetails || {});
          setPayments(Array.isArray(payments) ? payments : [payments]);
          setMemorialDays(commitmentDetails.MemorialDays || []);
          
          setInitialMemorialDayLength(commitmentDetails.MemorialDays?.length||0);
        }
      } catch (error) {
        console.error("Error fetching commitment details:", error);
        toast.error("שגיאה בטעינת נתוני ההתחייבות");
      }
      if (!commitmentRes.data|| !commitmentRes.data.commitmentDetails.CampainName) {
        return;
      }
      try {
        const response = await getCampainByName(
          commitmentRes.data.commitmentDetails.CampainName
        );
        setCampainStartDate(new Date(response.data.data.campain.startDate));
        setCampainEndDate(new Date(response.data.data.campain.endDate));
        setCampain(response.data.data.campain);
      } catch (error) {
        toast.error("שגיאה בטעינת הקמפיינים");
      }

      try {
        const res = await GetAllCampainMemorialDates(
          commitmentRes.data.commitmentDetails.CampainName
        );
        if (res.status === 200) {
          setAllCampainMemorialDates(res.data.data.memorialDates);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (commitmentId) {
      fetchCommitmentDetails();
    }
  }, []);

  // פונקציה לטיפול במחיקת תשלום
  const handleDeletePayment = async (paymentId) => {
    try {
      console.log("paymentId", paymentId);

      const response = await deletePayment(paymentId); // קרא ל-API למחיקת תשלום
      if (response.status === 200) {
        toast.success("התשלום נמחק בהצלחה!", {
          onClose: () => window.location.reload(),autoClose: 3000
        });
        window.location.reload();
      } else {
        toast.error("שגיאה במחיקת התשלום");
      }
    } catch (error) {
      toast.error("שגיאה במחיקת התשלום");
      console.error("Error deleting payment:", error);
    }
  };

  const handleDateChange = (index, memorialDate) => {
    
    setMemorialDays((prevMemorialDays) => {
      const newMemorialDays = [...prevMemorialDays];
      newMemorialDays[index] = {
        ...newMemorialDays[index],
        date: memorialDate.date,
        hebrewDate: memorialDate.jewishDateStrHebrew,
      };
      return newMemorialDays;
    });
  };
  function AddMemorialDay() {
    const remainingMemorialDays =
      Math.floor(
        commitmentDetails.CommitmentAmount / campain.minimumAmountForMemorialDay
      ) - MemorialDays.length;

    if (remainingMemorialDays <= 0) {
      toast.error("התחייבות אינה מספיקה להוספת עוד ימי הנצחה  ");
      return;
    }

    if (
      MemorialDays.length === 0 ||
      MemorialDays[MemorialDays.length - 1].hasOwnProperty("date")
    ) 
    
    
    {
      // Handle the case where there are no memorial days, or the last one doesn't have a "date" property
      setMemorialDays([...MemorialDays, {}]);
    }
  }
  function removeMemorialDay(index) {
    setMemorialDays((prevMemorialDays) => {
      const newMemorialDays = [...prevMemorialDays];
      newMemorialDays.splice(index, 1);
      return newMemorialDays;
    });
  }

  function handelCommartionChange(index, event) {
    setMemorialDays((prevMemorialDays) => {
      const newMemorialDays = [...prevMemorialDays];
      newMemorialDays[index][event.target.name] = event.target.value;
      return newMemorialDays;
    });
  }
  const allowedSelectionRange = (day) => {
    if (day.date < campainStartDate || day.date > campainEndDate) {
      return false;
    }
    for (let i = 0; i < allCampainMemorialDates.length; i++) {
      if (isTheSameDate(day.date, new Date(allCampainMemorialDates[i]))) {
        return false;
      }
    for (let i = 0; i < MemorialDays.length; i++) {
      if (
        isTheSameDate(new Date(MemorialDays[i].date), day.date)
      ) {
        return false;
      }
    }

    }

    return true;
  };
  function isTheSameDate(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <>
      <ToastContainer autoClose={5000} />

      <form className="max-w-7xl mx-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px]">
          <label>
            מזהה אנש:
            <input
              type="text"
              name="AnashIdentifier"
              value={commitmentDetails.AnashIdentifier || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              readOnly
            />
          </label>
          <label>
            מספר זהות:
            <input
              type="text"
              name="PersonID"
              value={commitmentDetails.PersonID || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              readOnly
            />
          </label>
          <label>
            שם:
            <input
              type="text"
              name="FirstName"
              value={commitmentDetails.FirstName || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              readOnly
            />
          </label>
          <label>
            משפחה:
            <input
              type="text"
              name="LastName"
              value={commitmentDetails.LastName || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              readOnly
            />
          </label>
          <label>
            סכום התחייבות:
            <input
              type="number"
              name="CommitmentAmount"
              value={commitmentDetails.CommitmentAmount || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            סכום שולם:
            <input
              type="number"
              name="AmountPaid"
              value={commitmentDetails.AmountPaid || 0}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            סכום שנותר:
            <input
              type="number"
              name="AmountRemaining"
              value={commitmentDetails.AmountRemaining || 0}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            מספר תשלומים:
            <input
              type="number"
              name="NumberOfPayments"
              value={commitmentDetails.NumberOfPayments || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            תשלומים שבוצעו:
            <input
              type="number"
              name="PaymentsMade"
              value={commitmentDetails.PaymentsMade || 0}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            תשלומים שנותרו:
            <input
              type="number"
              name="PaymentsRemaining"
              value={commitmentDetails.PaymentsRemaining || 0}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            מתרים:
            <input
              type="text"
              name="Fundraiser"
              value={commitmentDetails.Fundraiser || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            אופן התשלום:
            <select
              name="PaymentMethod"
              value={commitmentDetails.PaymentMethod || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
          </label>
          <label>
            הערות:
            <input
              type="text"
              name="Notes"
              value={commitmentDetails.Notes || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          <label>
            תשובה למתרים:
            <input
              type="text"
              name="ResponseToFundraiser"
              value={commitmentDetails.ResponseToFundraiser || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </label>
          {commitmentDetails.CampainName && (
            <>
              <label>
                קמפיין:
                <input
                  name="CampainName"
                  type="text"
                  value={commitmentDetails.CampainName || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  readOnly
                />
              </label>

              <div>
                <button
                  type="button"
                  onClick={() => AddMemorialDay()}
                  className="m-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-[40px]"
                >
                  +
                </button>
                <p className="flex items-center">
                  סכום מינימום ליום הנצחה:&nbsp;
                  <span className="flex items-center">
                    {campain.minimumAmountForMemorialDay}
                    <BiShekel />
                  </span>
                </p>
                <p>
                  מספר ימי זכות שנותרו ליום הנצחה:&nbsp;
                  <span>
                    {Math.floor(
                      commitmentDetails.CommitmentAmount /
                        campain.minimumAmountForMemorialDay
                    ) - MemorialDays.length}
                  </span>
                </p>
              </div>

              <div className="col-span-1 md:col-span-5 grid grid-cols-1 md:grid-cols-5">
                {MemorialDays.length > 0 &&
                  MemorialDays.map((memorialDay, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 m-2 p-2 rounded relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeMemorialDay(index)}
                        className="text-red-500 cursor-pointer hover:text-red-700 absolute top-1 left-1"
                      >
                        x
                      </button>
                      <label>
                        יום הנצחה:
                        {memorialDay.date?'':<p className="text-red-500 text-sm">אנא בחר תאריך הנצחה</p>}
                        <ReactJewishDatePicker
                          value={
                            memorialDay.date
                              ? new Date(memorialDay.date)
                              : campainStartDate
                          }
                          onClick={(day) => handleDateChange(index, day)}
                          isHebrew
                          className="mt-2 block w-full p-2 border border-gray-300 rounded"
                          canSelect={(day) => allowedSelectionRange(day)}
                        />
                      </label>
                      <label>
                        הנצחה:
                        <textarea
                          name="Commeration"
                          value={memorialDay.Commeration || ""}
                          onChange={(e) => handelCommartionChange(index, e)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded"
                          rows="3" // You can adjust the number of rows as needed
                        ></textarea>
                      </label>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          אשר עדכון פרטים
        </button>
        <button
          className="m-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={openPaymentModal}
          disabled={isLoading}
        >
          הוסף תשלום
        </button>
        <button
          className="m-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={openModal}
          disabled={isLoading}
        >
          מחק התחייבות
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Deletion"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">אישור מחיקה</h2>
          <p className="mb-4">האם אתה בטוח שברצונך למחוק את ההתחייבות?</p>
          <div className="flex justify-end">
            <button
              className="mr-2 p-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              onClick={closeModal}
              disabled={isLoading}
            >
              ביטול
            </button>
            <button
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleDelete}
              disabled={isLoading}
            >
              מחק
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isPaymentModalOpen}
        onRequestClose={closePaymentModal}
        contentLabel="Add Payment"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">הוסף תשלום</h2>
          <form onSubmit={handlePaymentSubmit}>
            <label>
              סכום:
              <input
                type="number"
                name="Amount"
                value={paymentData.Amount}
                onChange={handlePaymentChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </label>
            <label>
              תאריך:
              <input
                type="date"
                name="Date"
                value={paymentData.Date}
                onChange={handlePaymentChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </label>
            <label>
              אמצעי תשלום:
              <select
                name="PaymentMethod"
                value={paymentData.PaymentMethod}
                onChange={handlePaymentChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
            </label>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
                disabled={isLoading}
              >
                שמור תשלום
              </button>
              <button
                className="mr-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={closePaymentModal}
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <div className="max-w-4xl mx-auto p-3">
        <h3 className="text-lg font-semibold mb-4 text-center">
          תשלומים קשורים
        </h3>
        <div className="overflow-y-auto max-h-80">
          {" "}
          {/* הגדרת גובה מקסימלי וגלילה אנכית */}
          <table className="table-auto mx-auto bg-white border-separate border-spacing-2 min-w-full">
            <thead>
              <tr className="text-center">
                <th className="px-4 py-2 border-b">סכום</th>
                <th className="px-4 py-2 border-b">תאריך</th>
                <th className="px-4 py-2 border-b">אמצעי תשלום</th>
                <th className="px-4 py-2 border-b">מחיקה</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="text-center">
                    <td className="px-4 py-2 border-b">{payment.Amount}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(payment.Date).toLocaleDateString("he-IL")}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {payment.PaymentMethod}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 border-b text-center" colSpan="4">
                    אין תשלומים להצגה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CommitmentDetailsPage;
