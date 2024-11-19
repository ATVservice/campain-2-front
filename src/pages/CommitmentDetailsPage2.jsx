import React ,{ useState,useEffect,useRef} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AnashCommitmentDetails from '../components/AnashCommitmentDetails'
import {getCommitmentDetails,getCampainByName,getAllMemorialDates,updateCommitmentDetails,uploadCommitmentPayment,deletePayment,deleteCommitment} from '../requests/ApiRequests'
import AnashPaymentsDetails from '../components/AnashPaymentsDetails'
import PaymentForm from '../components/PaymentForm'
import { set } from 'date-fns'
import { toast } from 'react-toastify'

function CommitmentDetailsPage2() {

    const { commitmentId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [commitmentForm, setCommitmentForm] = useState({});
    const [campain, setCampain] = useState(null);
    const [allCampainMemorialDates, setAllCampainMemorialDates] = useState([]);
    const [commitmentPayments, setCommitmentPayments] = useState([]);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const navigate = useNavigate();
    

    useEffect(() => {
      const fetchCommitmentDetails = async () => {
          if (!commitmentId) return; // Early return if no ID is provided
  
          try {
              setIsLoading(true); // Start loading
  
              // Fetch commitment details
              const commitmentRes = await getCommitmentDetails(commitmentId);
              console.log(commitmentRes);
              const commitmentData = commitmentRes.data.commitment;
              const commitmentPayments = commitmentRes.data.payments;
              setCommitmentForm(commitmentData);
              setCommitmentPayments(commitmentPayments);
  
              // Fetch campaign details
              const campainRes = await getCampainByName(commitmentData.CampainName);
              console.log(campainRes);
              setCampain(campainRes.data.data.campain);
  
              // Fetch memorial dates
              const memorialDatesRes = await getAllMemorialDates(commitmentData.CampainName);
              console.log(memorialDatesRes);
              setAllCampainMemorialDates(memorialDatesRes.data.data.memorialDates);
              
  
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
      const response = await updateCommitmentDetails(commitmentForm);
      if (response && response.status === 200) {
        setCommitmentForm(response.data.updatedCommitment);
        toast.success( 'התחייבות עודכנה בהצלחה');
        
      }
    
      
    } catch (error) {
      console.error("Error updating commitment:", error.response.data.message);
      toast.error(error.response.data.message);
    }


    
  };

  const UploadCommitmentPayment = async (paymentData) => {
    try {
        console.log(paymentData);
      const response = await uploadCommitmentPayment(paymentData);
      if (response && response.status === 200) {
        console.log(console.log(response.data.newPayment));
        console.log(console.log(response.data.updatedCommitment));
        setCommitmentForm(response.data.updatedCommitment);
        
        setCommitmentPayments([...commitmentPayments, response.data.newPayment]);
        toast.success( 'התשלום נוסף בהצלחה');

      } else {
        console.error("Commitment update failed.");
      }
    } catch (error) {
      console.error("Error updating commitment:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  const handelAddPayment = () => {
    setShowPaymentForm(true);
    
};

const handelDeleteCommitment = async () => {
    try {
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
    

};

  
    if(isLoading ){
        return (
                <p>Loading...</p>
        )
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
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handelDeleteCommitment}>
            מחק התחייבות
        </button>


        </div>

        {showPaymentForm && (
            <PaymentForm onSubmit={UploadCommitmentPayment} onClose={() => setShowPaymentForm(false)} campainName={campain.CampainName} anashIdentifier={commitmentForm.AnashIdentifier}/>
        )}

        <AnashCommitmentDetails commitmentForm={commitmentForm} setCommitmentForm={setCommitmentForm}
         campain={campain} allCampainMemorialDates={allCampainMemorialDates}/>
        <AnashPaymentsDetails commitmentPayments={commitmentPayments} 
        setCommitmentPayments={setCommitmentPayments} setCommitmentForm={setCommitmentForm}/>

    </div>
  )
}

export default CommitmentDetailsPage2
