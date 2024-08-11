import React, { useState } from 'react';
import { uploadCommitment } from '../requests/ApiRequests';

function CommitmentForm({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        AnashIdentifier: '',
        PersonID: '',
        FirstName: '',
        LastName: '',
        CommitmentAmount: '',
        AmountPaid: '',
        AmountRemaining: '',
        NumberOfPayments: '',
        PaymentsMade: '',
        PaymentsRemaining: '',
        Fundraiser: '',
        PaymentMethod: '',
        Notes: '',
        ResponseToFundraiser: ''
        // Campaign: ''
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the form data to the server
            const response = await uploadCommitment(formData);
            
            if (response && response.status === 200) {
                console.log('Commitment saved successfully');
                onSubmit(formData); // Optional: Call onSubmit callback if needed
                onClose(); // Close the form after submission
            } else {
                console.error('Failed to save commitment');
            }
        } catch (error) {
            console.error('Error saving commitment:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">Add Commitment</h2>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>מזהה אנש:</label>
                        <input type="text" name="AnashIdentifier" value={formData.AnashIdentifier} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>מספר זהות:</label>
                        <input type="text" name="PersonID" value={formData.PersonID} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>שם:</label>
                        <input type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} />
                    </div>
                    <div>
                        <label>משפחה:</label>
                        <input type="text" name="LastName" value={formData.LastName} onChange={handleChange} />
                    </div>
                    <div>
                        <label>סכום התחייבות:</label>
                        <input type="text" name="CommitmentAmount" value={formData.CommitmentAmount} onChange={handleChange} />
                    </div>
                    <div>
                        <label>סכום שולם:</label>
                        <input type="text" name="AmountPaid" value={formData.AmountPaid} onChange={handleChange} />
                    </div>
                    <div>
                        <label>סכום שנותר:</label>
                        <input type="text" name="AmountRemaining" value={formData.AmountRemaining} onChange={handleChange} />
                    </div>
                    <div>
                        <label>מספר תשלומים:</label>
                        <input type="text" name="NumberOfPayments" value={formData.NumberOfPayments} onChange={handleChange} />
                    </div>
                    <div>
                        <label>תשלומים שבוצעו:</label>
                        <input type="text" name="PaymentsMade" value={formData.PaymentsMade} onChange={handleChange} />
                    </div>
                    <div>
                        <label>תשלומים שנותרו:</label>
                        <input type="text" name="PaymentsRemaining" value={formData.PaymentsRemaining} onChange={handleChange} />
                    </div>
                    <div>
                        <label>מתרים:</label>
                        <input type="text" name="Fundraiser" value={formData.Fundraiser} onChange={handleChange} />
                    </div>
                    <div>
                        <label>אופן התשלום:</label>
                        <input type="text" name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} />
                    </div>
                    <div>
                        <label>הערות:</label>
                        <input type="text" name="Notes" value={formData.Notes} onChange={handleChange} />
                    </div>
                    <div>
                        <label>תשובה למתרים:</label>
                        <input type="text" name="ResponseToFundraiser" value={formData.ResponseToFundraiser} onChange={handleChange} />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-4 px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default CommitmentForm;
