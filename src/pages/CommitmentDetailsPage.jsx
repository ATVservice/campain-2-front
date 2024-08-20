import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCommitmentDetails} from '../requests/ApiRequests';
import PaymentForm from '../components/ManualPaymentForm';
import CommitmentForm from '../components/ManualCommitmentForm';

function CommitmentDetailsPage() {
  const { commitmentId } = useParams();
  console.log('Commitment ID:', commitmentId); 
  const navigate = useNavigate();
  const [commitmentDetails, setCommitmentDetails] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const commitmentResponse = await getCommitmentDetails(commitmentId);
        console.log(commitmentResponse)
        setCommitmentDetails(commitmentResponse.data.data.commitmentDetails);
        // const paymentsResponse = await getPaymentsByCommitmentId(commitmentId);
        // setPayments(paymentsResponse.data);
      } catch (error) {
        console.error('Error fetching commitment details:', error);
      }
    };
    fetchDetails();
  }, [commitmentId]);

  const handleEdit = () => {
    setIsEditFormOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCommitment(commitmentId);
      navigate('/commitments'); // Redirect to the commitments list after deletion
    } catch (error) {
      console.error('Error deleting commitment:', error);
    }
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  return (
    <div className="commitment-details-page p-4">
      {commitmentDetails && (
        <div className="commitment-details border rounded p-4 mb-4">
          <h2>Commitment Details</h2>
          <p><strong>ID:</strong> {commitmentDetails._id}</p>
          <p><strong>Name:</strong> {commitmentDetails.Fundraiser} {commitmentDetails.LastName}</p>
          <p><strong>Commitment Amount:</strong> {commitmentDetails.amount}</p>
          {/* Add other details here */}
          <div className="buttons mt-4">
            <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded">Edit</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded ml-2">Delete</button>
          </div>
        </div>
      )}
      {isEditFormOpen && (
        <CommitmentForm
          commitment={commitmentDetails}
          onClose={handleCloseEditForm}
        />
      )}

      <div className="payments-list">
        <h3>Related Payments</h3>
        {payments.length > 0 ? (
          <ul className="list-disc pl-4">
            {payments.map(payment => (
              <li key={payment.id}>
                <p><strong>Date:</strong> {payment.date}</p>
                <p><strong>Amount:</strong> {payment.amount}</p>
                {/* Add other payment details here */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No payments found for this commitment.</p>
        )}
      </div>
    </div>
  );
}

export default CommitmentDetailsPage;
