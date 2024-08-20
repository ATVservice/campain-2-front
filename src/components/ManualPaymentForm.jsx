import React, { useState } from 'react';
import { uploadPayment } from '../requests/ApiRequests';

function PaymentForm({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        AnashIdentifier: '',
        PersonID: '',
        CommitmentId: '',
        Amount: '',
        Date: '',
        PaymentMethod: '',
        // Campaign: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting payment form with data:', formData); // Debugging line
        try {
            const response = await uploadPayment(formData);
            
            if (response && response.status === 200) {
                console.log('Payment saved successfully');
                //onSubmit(formData); // Optional: Call onSubmit callback if needed
                onClose(); // Close the form after submission
            } else {
                console.error('Failed to save payment');
            }
        } catch (error) {
            console.error('Error saving payment:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">הוסף תשלום</h2>
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
                        <label>מספר התחייבות:</label>
                        <input type="text" name="CommitmentId" value={formData.CommitmentId} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>סכום:</label>
                        <input type="text" name="Amount" value={formData.Amount} onChange={handleChange} />
                    </div>
                    <div>
                        <label>תאריך:</label>
                        <input type="date" name="Date" value={formData.Date} onChange={handleChange} />
                    </div>
                    <div>
                        <label>אופן התשלום:</label>
                        <input type="text" name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} />
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

export default PaymentForm;
