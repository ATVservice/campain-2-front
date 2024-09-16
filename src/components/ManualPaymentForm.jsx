import React, { useState, useEffect } from 'react';
import { uploadPayment, getCampains,getCommitmentByAnashAndCampain,uploadCommitmentPayment,getCommitment } from '../requests/ApiRequests';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PaymentForm({ onClose,  rowData, validatePayment,setRowData}) {
    const [formData, setFormData] = useState({
        AnashIdentifier: '',
        Amount: '',
        Date: '',
        PaymentMethod: '',
        CampainName: ''
    });

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                const response = await getCampains();
                setCampaigns(response.data.data.campains); // הנחה שהמידע יושב במערך בשם data
            } catch (error) {
                toast.error('שגיאה בטעינת הקמפיינים');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        let commitmentRes = null;
    
        try {
            // Validation before proceeding with payment
            if (formData.Amount <= 0) {
                toast.error('הסכום לתשלום חייב להיות גדול מ-0');
                return;
            }
    
            commitmentRes = await getCommitmentByAnashAndCampain(formData.AnashIdentifier, formData.CampainName);
            formData.CommitmentId = commitmentRes.data?._id;
        } catch (error) {
            toast.error('התחייבות לא נמצאה');
            return;
        }
    
        try {
            const response = validatePayment(commitmentRes.data, parseFloat(formData.Amount));
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            onClose();

            return;
        }
    
        try {
            const res = await uploadCommitmentPayment(formData);
            toast.success('התשלום נוסף בהצלחה');
        } catch (error) {
            toast.error(error.message);
            return;
        }
    
        try {
            const response = await getCommitment();
            setRowData(response.data.data.commitment || []);

        } catch (error) {
            console.error('Error fetching commitments:', error);
        } finally {
            console.log('e');
            // Finally will execute regardless of any return or error
            onClose();
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
                        <label>סכום:</label>
                        <input type="number" step="0.01" name="Amount" value={formData.Amount} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>תאריך:</label>
                        <input type="date" name="Date" value={formData.Date} onChange={handleChange} required />
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
                        <label>קמפיין:</label>
                        <select name="CampainName" value={formData.CampainName} onChange={handleChange} required>
                            <option value="">בחר קמפיין</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign._id} value={campaign.CampainName}>
                                    {campaign.CampainName}
                                </option>
                            ))}
                        </select>
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

export default PaymentForm;
