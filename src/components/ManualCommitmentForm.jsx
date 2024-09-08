import React, { useState, useEffect } from 'react';
import { uploadCommitment, getCampains } from '../requests/ApiRequests';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        ResponseToFundraiser: '',
        CampainName: ''
    });

    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await getCampains();
                setCampaigns(response.data.data.campains); // הנחה שהמידע יושב במערך בשם data
            } catch (error) {
                toast.error('שגיאה בטעינת הקמפיינים');
            }
        };

        fetchCampaigns();
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // const calculatedPaymentsMade = formData.NumberOfPayments - formData.PaymentsRemaining;
            // const calculatedAmountRemaining = formData.CommitmentAmount - formData.AmountPaid;

            // // בדיקות תקינות
            // if (calculatedPaymentsMade !== formData.PaymentsMade) {
            //     toast.error('מספר תשלומים שבוצעו אינו תואם את החישוב.');
            //     return;
            // }

            // if (calculatedAmountRemaining !== formData.AmountRemaining) {
            //     toast.error('סכום ההתחייבות שנשאר אינו תואם את החישוב.');
            //     return;
            // }
            // שליחת נתוני הטופס לשרת
            const response = await uploadCommitment(formData);

            if (response && response.status === 200) {
                const { successfulCommitments, failedCommitments } = response.data;

                if (successfulCommitments.length > 0) {
                    toast.success('ההתחייבות נוספה בהצלחה!');
                    console.log('Commitment saved successfully');
                    onSubmit(formData); // קריאה אופציונלית ל-callback onSubmit אם נדרש
                    onClose(); // סגירת הטופס לאחר השמירה
                }

                if (failedCommitments.length > 0) {
                    failedCommitments.forEach((failedCommitment) => {
                        toast.error(`שגיאה: ${failedCommitment.reason}`);
                        console.error(`Error: ${failedCommitment.reason}`);
                    });
                }
            } else {
                toast.error('שגיאה בשמירת ההתחייבות.');
                console.error('Failed to save commitment');
            }
        } catch (error) {
            toast.error('שגיאה בשמירת ההתחייבות.');
            console.error('Error saving commitment:', error);
        }
    };


    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-75  z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">הוסף התחייבות</h2>
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
                        <label>קמפיין:</label>
                        <select name="CampaignId" value={formData.CampaignId} onChange={handleChange} required>
                            <option value="">בחר קמפיין</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign._id} value={campaign._id}>
                                    {campaign.campainName}
                                </option>
                            ))}
                        </select>
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
                        <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} required>
                            <option value="">בחר אופן תשלום</option>
                            <option value="מזומן">מזומן</option>
                            <option value="שיק">שיק</option>
                            <option value="אשראי">אשראי</option>
                            <option value="הו&quot;ק אשראי">הו"ק אשראי</option>
                            <option value="העברה בנקאית">העברה בנקאית</option>
                            <option value="הו&quot;ק בנקאית">הו"ק בנקאית</option>
                        </select>
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
                        <button type="button" onClick={onClose} className="mr-4 px-4 py-2 bg-red-500 text-white rounded">ביטול</button>
                        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">שמור טופס</button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default CommitmentForm;
