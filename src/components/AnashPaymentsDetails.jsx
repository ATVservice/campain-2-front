import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deletePayment, validateUserPassword, transferPayment,uploadCommitmentPayment } from "../requests/ApiRequests";
import { FaTrash, FaUndo } from "react-icons/fa";
import { useAuth } from "../components/AuthProvider";
import PasswordConfirmationModal from "./PasswordConfirmationModal";
import Spinner from "./Spinner";
import { set } from "lodash";
function AnashPaymentsDetails({
  commitmentPayments,
  setCommitmentPayments,
  setCommitmentForm,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState(null);
  
  const [showTransferConfirmationModal, setShowTransferConfirmationModal] = useState(false);
  const [transferData, setTransferData] = useState({paymentId: '', campainName: ''});

  const [showRefundConfirmationModal, setShowRefundConfirmationModal] = useState(false);
  const [refundData, setRefundData] = useState(null);
  
  const [password, setPassword] = useState('');
  const [massage, setMassage] = useState('');

  const handleDeletePayment = async (password) => {
    try {
      setIsLoading(true);
      const validateRes = await validateUserPassword(password);
      if(validateRes.status==200)
      {
        
        const deleteRes = await deletePayment(paymentIdToDelete);
        if (deleteRes.status === 200) {
          setCommitmentPayments(
            commitmentPayments.filter((payment) => payment._id !== paymentIdToDelete)
          );
          setCommitmentForm(deleteRes.data.updatedCommitment);
          toast.success("התשלום נמחק בהצלחה");
          setShowDeleteConfirmationModal(false);
        }

      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || 'שגיאה במחיקת התשלום');
    }
    finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  const onSelectPaymentToTransfer = (payment,campainName) => {
    if(!payment||!campainName) return
    setTransferData({paymentId: payment._id, campainName: campainName});
    setMassage(`לאישור העברת תשלום זה בסך ${payment.Amount} ש"ח  לקמפיין ${payment.CampainName} אנא הזן סיסמה`);
    setShowTransferConfirmationModal(true);
  };


  const handleTransferPayment = async (password) => {
    setIsLoading(true);
    console.log(transferData);

    try {
      const validateRes = await validateUserPassword(password);
      if(validateRes.status===200){
       const res = await transferPayment(transferData.paymentId,transferData.campainName);
       console.log(res);
       if(res.status===200)
       {

         toast.success('התשלום הועבר בהצלחה');
         setCommitmentPayments(commitmentPayments.filter(payment => payment._id !== transferData.paymentId));
         setCommitmentForm(res.data.prevCommitment);
         setShowTransferConfirmationModal(false);
         setTransferData({paymentId: '', campainName: ''});
         
       }
      }
    } catch (error) {
      console.error('Error transfering payment:', error);
        toast.error(error.response.data?.message||'שגיאה בהעברת התשלום');
    }
    finally{
      setIsLoading(false);
      setPassword('');
    }
  };

  const handelSelectRefuendPayment = async (payment) => {
    if(!payment) return
    const { _id, ...refundPayment } = payment;  // Destructure 'id' out and keep the rest in refundPayment
    // Modify the refundPayment as required
    const updatedRefundPayment = {
      ...refundPayment,               // Spread the remaining properties of the original payment
      Amount: -payment.Amount,        // Change the amount
      PaymentMethod: 'החזר תשלום מזומן', // Update payment method
      Date: new Date(),               // Set the current date
    };
    setRefundData(updatedRefundPayment);
    setShowRefundConfirmationModal(true); 
    // UploadCommitmentPayment(updatedRefundPayment);

   
  };

  const handelUploadRefundPayment = async (password) => {
    try {
      setIsLoading(true);
      const validateRes = await validateUserPassword(password);
      if(validateRes.status===200){
        const res = await uploadCommitmentPayment(refundData);
        console.log(res);
        if(res.status===200){
          toast.success('  החזר תשלום בוצע בהצלחה');
          setCommitmentPayments((prevPayments) => [...prevPayments, res.data.newPayment]);
          setCommitmentForm(res.data.updatedCommitment);

          setShowRefundConfirmationModal(false);
          setRefundData(null);
        }
      }
    } catch (error) {
      console.error('Error transfering payment:', error);
        toast.error(error.response.data?.message||'שגיאה בהעברת התשלום');
  }
    finally{
      setIsLoading(false);
      setPassword('');
    }


  };


  


    



  if (isLoading) {
    return <Spinner />
  }
  return (
    <div>
      <PasswordConfirmationModal
        isOpen={showDeleteConfirmationModal}
        onClose={() => setShowDeleteConfirmationModal(false)}
        onSubmit={handleDeletePayment}
        password={password}
        setPassword={setPassword}
        massage={'למחיקת תשלום זה אנא הזן סיסמה'}
      />
      <PasswordConfirmationModal
        isOpen={showTransferConfirmationModal}
        onClose={() => setShowTransferConfirmationModal(false)}
        onSubmit={handleTransferPayment}
        password={password}
        setPassword={setPassword}
        massage={'להעברת תשלום זה אנא הזן סיסמה'}
      />
      <PasswordConfirmationModal
        isOpen={showRefundConfirmationModal}
        onClose={() => setShowRefundConfirmationModal(false)}
        onSubmit={handelUploadRefundPayment}
        password={password}
        setPassword={setPassword}
        massage={'לביצוע החזר תשלום זה אנא הזן סיסמה'}
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
            <th className="px-4 py-2 border-b">העברה</th>
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
                    setShowDeleteConfirmationModal(true);
                    setPaymentIdToDelete(payment._id);
                    if (payment && payment.PaymentMethod == 'מזומן')
                      toast.warning('מחיקת תשלום מזומן זה תשפיע על יתרת קופה קטנה')


                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
              <td>
                <select className="w-full border rounded outline-none p-1"  name="transfer" onChange={(e) =>
                {
                  console.log(e.target.value);
                  onSelectPaymentToTransfer(payment, e.target.value)}

                }
                
                
                   
                   >

                <option value="">בחר קמפיין  </option>

                  {
                    payment.AnashDetails?.Campaigns
                    ?.map((campainName) => (
                      <option key={campainName} value={campainName}>
                        {campainName}
                      </option>
                      
                    ))


                  }


                </select>
              </td>
              <td className="px-4 py-2 border-b">
                {payment && payment.Amount > 0 && <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handelSelectRefuendPayment(payment)}
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
