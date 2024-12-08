import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deletePayment, validateUserPassword,  } from "../requests/ApiRequests";
import { FaTrash, FaUndo } from "react-icons/fa";
import { useAuth } from "../components/AuthProvider";
import PasswordConfirmationModal from "./PasswordConfirmationModal";
import Spinner from "./Spinner";
function AnashPaymentsDetails({
  commitmentPayments,
  setCommitmentPayments,
  setCommitmentForm,
  UploadCommitmentPayment
}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState(null);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);



  const handleDeletePayment = async (paymentId) => {
    try {
      setIsLoading(true);
      const res = await deletePayment(paymentId);
      if (res.status === 200) {
        setCommitmentPayments(
          commitmentPayments.filter((payment) => payment._id !== paymentId)
        );
        setCommitmentForm(res.data.updatedCommitment);
        toast.success("התשלום נמחק בהצלחה");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally {
      setIsLoading(false);
    }
  };
  const handleValidatePassword = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);


      const res = await validateUserPassword(password);
      console.log(res);

      if (res.status === 200) {
        setShowConfirmationModal(false);
        await handleDeletePayment(paymentIdToDelete);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'שגיאה במחיקת התשלום');
    }
    finally {
      setPassword('');
      setIsLoading(false);
    }
  };

  const handelRefuendPayment = async (payment) => {
    const { _id, ...refundPayment } = payment;  // Destructure 'id' out and keep the rest in refundPayment
    console.log(refundPayment);
    // Modify the refundPayment as required
    const updatedRefundPayment = {
      ...refundPayment,               // Spread the remaining properties of the original payment
      Amount: -payment.Amount,        // Change the amount
      PaymentMethod: 'החזר תשלום', // Update payment method
      Date: new Date(),               // Set the current date
    };
    UploadCommitmentPayment(updatedRefundPayment);

    //  if (res.status === 200) {
    //   setCommitmentPayments(
    //     ...commitmentPayments,
    //     res.data.newPayment
    //   );
    //   setCommitmentForm(res.data.updatedCommitment);
    //   toast.success("התשלום נוסף בהצלחה");
    // }


  };



  if (isLoading) {
    return <Spinner />
  }
  return (
    <div>
      <PasswordConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onSubmit={handleValidatePassword}
        password={password}
        setPassword={setPassword}
      />

      <div className="mb-2 mt-4 mx-auto flex justify-center">
        <h2 className="text-2xl font-semibold mb-4 text-center border-b border-gray-500 mx-auto inline-block">
          תשלומים
        </h2>
      </div>
      <table className="table-auto mx-auto bg-white w-1/2 border border-gray-200 rounded mb-4">
        <thead>
          <tr className="text-center">
            <th className="px-4 py-2 border-b">סכום</th>
            <th className="px-4 py-2 border-b">תאריך</th>
            <th className="px-4 py-2 border-b">אמצעי תשלום</th>
            <th className="px-4 py-2 border-b">מחיקה</th>
            <th className="px-4 py-2 border-b">החזר</th>
          </tr>

          {commitmentPayments.sort((a, b) => new Date(b.Date) - new Date(a.Date)).map((payment) => (
            <tr key={payment._id} className={`text-center ${payment.Amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <td className="px-4 py-2 border-b">{payment.Amount}</td>
              <td className="px-4 py-2 border-b">
                {new Date(payment.Date).toLocaleDateString("he-IL")}
              </td>
              <td className="px-4 py-2 border-b">{payment.PaymentMethod}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => {
                    setShowConfirmationModal(true);
                    setPaymentIdToDelete(payment._id);
                    if (payment && payment.PaymentMethod == 'מזומן')
                      toast.warning('מחיקת תשלום מזומן זה תשפיע על יתרת קופה קטנה')


                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
              <td className="px-4 py-2 border-b">
                {payment && payment.Amount > 0 && <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handelRefuendPayment(payment)}
                >
                  <FaUndo />
                </button>}
              </td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
}

export default AnashPaymentsDetails;
