import React,{ useState, useEffect} from 'react'
import PaymentsWithoutCommitmentTable from '../components/PaymentsWithoutCommitmentTable'
import {getPaymentsWithoutCommitment,transferPayment,validateUserPassword} from "../requests/ApiRequests";
import PasswordConfirmationModal from "../components/PasswordConfirmationModal";
import { toast } from 'react-toastify';
import Spinner from "../components/Spinner";


function PaymentsWithoutCommitment() {

    const [payments, setPayments] = useState([]);
    const [selectedCampainName, setSelectedCampainName] = useState(null);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [password, setPassword] = useState('');
    const [massage, setMassage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect( () => {


        const fetchPayments = async () => {
            try {
                const response = await getPaymentsWithoutCommitment();
                setPayments(response.data.paymentsWithoutCommitment);
                console.log(response.data.paymentsWithoutCommitment);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
    
        fetchPayments();
    }
 , []);




 async function handeleTransferPayment(e) {
    // e.preventDefault();
    setLoading(true);

    try {
      const response = await validateUserPassword(password);
      if(response.status===200){
        const res = await transferPayment(selectedPaymentId,selectedCampainName);
        if(res.status===200)
          {
         console.log(res);

         toast.success('התשלום הועבר בהצלחה');
        //  setPayments(payments.filter(payment => payment._id !== selectedPaymentId));
         
          handleCloseModal();
       }
      }
    } catch (error) {
        toast.error(error.response.data.message||'שגיאה בהעברת התשלום');
      console.error('Error transfering payment:', error);
    }
    finally{
      setLoading(false);
    }
  


  }

  function handleSelectCampain(payment,paymentId, campainName) {
    if(!campainName||!paymentId) return
    setSelectedPaymentId(paymentId);
    setSelectedCampainName(campainName);
    setMassage(` לאישור העברת תשלום זה בסך ${payment.Amount} ש"ח  לקמפיין ${campainName} אנא הזן סיסמה`);

    
    setShowConfirmationModal(true);

   
  }
  function handleCloseModal() {
    setShowConfirmationModal(false);
    setPassword('');
    setSelectedCampainName(null);
    setSelectedPaymentId(null);
    setMassage('');

  }

  if(loading){
    return <Spinner />
  }





  return (
    <div>
      <PaymentsWithoutCommitmentTable rowsData={payments} onSelectCampain={handleSelectCampain} />
      {showConfirmationModal && (
        <PasswordConfirmationModal
          isOpen={showConfirmationModal}
          onClose={handleCloseModal}
          onSubmit={handeleTransferPayment}
          password={password}
          setPassword={setPassword}
          massage={massage} 
        />
      )}

      
    </div>
  )
}

export default PaymentsWithoutCommitment