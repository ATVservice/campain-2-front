import React ,{ useState,useEffect,useRef} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AnashCommitmentDetails from '../components/AnashCommitmentDetails'
import {getCommitmentDetails,getCampainByName,getAllMemorialDates,updateCommitmentDetails,uploadCommitmentPayment,deletePayment,deleteCommitment,validateUserPassword,getMemorialDaysByCommitment} from '../requests/ApiRequests'
import AnashPaymentsDetails from '../components/AnashPaymentsDetails'
import PaymentForm from '../components/PaymentForm'
import PasswordConfirmationModal from '../components/PasswordConfirmationModal'
import Spinner from '../components/Spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CommitmentDetailsPage2() {


    const { commitmentId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [commitmentForm, setCommitmentForm] = useState({});
    const [campain, setCampain] = useState(null);
    const [allCampainMemorialDates, setAllCampainMemorialDates] = useState([]);
    const [commitmentPayments, setCommitmentPayments] = useState([]);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [commitmentAmountBefourChange, setCommitmentAmountBefourChange] = useState(0);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [password, setPassword] = useState('');
  
    const navigate = useNavigate();

    useEffect(() => {
      const fetchCommitmentDetails = async () => {
          if (!commitmentId) return; // Early return if no ID is provided
  
          try {
              setIsLoading(true); // Start loading
              console.log('e');
  
              // Fetch commitment details
              const commitmentRes = await getCommitmentDetails(commitmentId);
              console.log(commitmentRes);
              const commitmentData = commitmentRes.data.commitment;
              const commitmentPayments = commitmentRes.data.payments;
              setCommitmentForm(commitmentData);
              setCommitmentPayments(commitmentPayments);
              setCommitmentAmountBefourChange(commitmentData.CommitmentAmount);
              
              // Fetch campaign details
              const campainRes = await getCampainByName(commitmentData.CampainName);
              console.log(campainRes);
              setCampain(campainRes.data.data.campain);
              
              // Fetch memorial dates
              const memoDaysRes = await getMemorialDaysByCommitment(commitmentData.AnashIdentifier,commitmentData.CampainName);
              console.log(memoDaysRes);
              setAllCampainMemorialDates(memoDaysRes.data?.length > 0 ? memoDaysRes.data : []);
              // const memorialDatesRes = await getAllMemorialDates(commitmentData.CampainName);
              // console.log(memorialDatesRes);
              
  
          } catch (error) {
              console.error("Error fetching commitment details:", error);
          } finally {
              setIsLoading(false); // End loading
          }
      };
  
      fetchCommitmentDetails();
  }, []); // Dependency array includes commitmentId


  const submitCommitmentUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await updateCommitmentDetails(commitmentForm);
      if (response && response.status === 200) {
        setCommitmentForm(response.data.updatedCommitment);
        setCommitmentAmountBefourChange(response.data.updatedCommitment.CommitmentAmount);
        const t = toast.success( 'התחייבות עודכנה בהצלחה')
        console.log(t);
        
      }
    
      
    } catch (error) {
      console.error("Error updating commitment:", error.response.data.message);
      toast.error(error.response.data.message||'שגיאה בעדכון התחייבות');
    }
    finally {
      setIsLoading(false);
    }


    
  };

  const UploadCommitmentPayment = async (paymentData) => {
    toast.success( 'התשלום נוסף בהצלחה');
    try {
      setIsLoading(true);
      const response = await uploadCommitmentPayment(paymentData);
      if (response && response.status === 200) {
        console.log(console.log(response));
        console.log(console.log(response.data.updatedCommitment));
        setCommitmentForm(response.data.updatedCommitment);
        
        setCommitmentPayments([...commitmentPayments, response.data.newPayment]);
        console.log('eeeeeee');

      } else {
        console.error("Commitment update failed.");
      }
    } catch (error) {
      toast.error(error.response.data.message||'שגיאה בהעלאת התשלום');
      console.log('ee');
      // console.log(error);
      // console.error("Error updating commitment:", error.response.data.message);
      // console.log(message);
    }
    finally {
      setIsLoading(false);
    }
  };
  const handelAddPayment = () => {
    setShowPaymentForm(true);
    
};

const handelDeleteCommitment = async () => {
    try {
      setIsLoading(true);
      const response = await deleteCommitment(commitmentForm._id);
      if (response && response.status === 200) {
        console.log(response.data.message);
        setCommitmentForm({});
        setCommitmentPayments([]);
        navigate('/commitments');
        toast.success( 'התחייבות נמחקה בהצלחה');
        
      } else {
        console.error("Commitment update failed.");
      }
    } catch (error) {
      console.error("Error updating commitment:", error);
      toast.error(error.response.data.message);
    }
    finally {
      setIsLoading(false);
    }
    

};
const handleValidatePassword = async (password) => {
  // console.log(e);
  //   e.preventDefault();
    try {
      setIsLoading(true);
      const res = await validateUserPassword(password);
      console.log(res);
      if (res.status === 200) {
        setShowConfirmationModal(false);
        await handelDeleteCommitment();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally {
      setPassword('');
      setIsLoading(false);
    }
  };

  
if(isLoading) {
  {

    return <div><Spinner /></div>
  }
}

  return (
    <div>
        <div className='flex justify-center gap-10 mt-4'>
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handelAddPayment}>
          הוספת תשלום

        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={submitCommitmentUpdate}>
            עדכן התחייבות
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => setShowConfirmationModal(true)}>
            מחק התחייבות
        </button>


        </div>

        {showConfirmationModal && (
            <PasswordConfirmationModal
                isOpen={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
                onSubmit={handleValidatePassword}
                password={password}
                setPassword={setPassword}
            />
        )}

        {showPaymentForm && (
            <PaymentForm onSubmit={UploadCommitmentPayment} onClose={() => setShowPaymentForm(false)} campainName={campain.CampainName} anashIdentifier={commitmentForm.AnashIdentifier}/>
        )}

        <AnashCommitmentDetails commitmentForm={commitmentForm} setCommitmentForm={setCommitmentForm}
         campain={campain}  memorialDates = {allCampainMemorialDates}/> 
        <AnashPaymentsDetails commitmentPayments={commitmentPayments} 
        setCommitmentPayments={setCommitmentPayments} setCommitmentForm={setCommitmentForm}/>

    </div>
  )
}

export default CommitmentDetailsPage2
