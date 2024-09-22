import React, { useState, useEffect } from 'react';
import { uploadCommitment, getCampains, getUserDetails, getCommitment } from '../requests/ApiRequests';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CommitmentForm({ onClose, onSubmit, campainName}) {
    const [formData, setFormData] = useState({
        AnashIdentifier: '',
        PersonID: '',
        FirstName: '',
        LastName: '',
        CommitmentAmount: 0,
        AmountPaid: 0,
        AmountRemaining: 0,
        NumberOfPayments: 0,
        PaymentsMade: 0,
        PaymentsRemaining: 0,
        Fundraiser: '',
        PaymentMethod: '',
        Notes: '',
        ResponseToFundraiser: '',
        CampainName: campainName
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
        const { name, value } = e.target;
        console.log(formData);
        console.log(name, value);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = async (e) => {
        const AnashIdentifier = e.target.value;

        if (AnashIdentifier) {
            try {
                // קריאה לפונקציה שמביאה את פרטי המשתמש על פי מזהה אנש
                const response = await getUserDetails(AnashIdentifier);
                console.log(response);

                const { PersonID, FirstName, LastName } = response.data.data.userDetails;

                // עדכון state עם הנתונים שהתקבלו
                setFormData(prevData => ({
                    ...prevData,
                    PersonID: PersonID || '',   // עדכון שדה תעודת זהות
                    FirstName: FirstName || '', // עדכון שדה שם פרטי
                    LastName: LastName || ''    // עדכון שדה שם משפחה
                }));
            } catch (error) {
                console.error('Error fetching user details:', error);
                toast.error('שגיאה בקבלת פרטי משתמש');
            }
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let updatedFormData = { ...formData };

        // בדיקות תקינות של שדות והוספת ערכי ברירת מחדל
        updatedFormData.AmountPaid = updatedFormData.AmountPaid || 0;
        updatedFormData.PaymentsMade = updatedFormData.PaymentsMade || 0;

        if (updatedFormData.AmountRemaining == 0) {
            updatedFormData.AmountRemaining = updatedFormData.CommitmentAmount;
        }

        if (updatedFormData.PaymentsRemaining == 0) {
            updatedFormData.PaymentsRemaining = updatedFormData.NumberOfPayments;
        }

        // בדיקות תקינות מותאמות
        if (updatedFormData.CommitmentAmount <= 0) {
            toast.error('סכום ההתחייבות חייב להיות גדול מאפס.');
            return;
        }

        if (updatedFormData.NumberOfPayments <= 0) {
            toast.error('מספר התשלומים חייב להיות גדול מאפס.');
            return;
        }

        if (updatedFormData.AmountRemaining < 0) {
            toast.error('סכום שנותר לתשלומים אינו יכול להיות שלילי.');
            return;
        }

        if (updatedFormData.PaymentsRemaining < 0) {
            toast.error('מספר התשלומים שנותרו אינו יכול להיות שלילי.');
            return;
        }

        if (updatedFormData.CommitmentAmount < updatedFormData.AmountPaid) {
            toast.error('סכום התחייבות לא יכול להיות קטן מסכום ששולם.');
            return;
        }

        if (updatedFormData.NumberOfPayments < updatedFormData.PaymentsMade) {
            toast.error('מספר התשלומים לא יכול להיות קטן ממספר התשלומים שבוצעו.');
            return;
        }
        const isValideAmount = updatedFormData.CommitmentAmount - updatedFormData.AmountPaid == updatedFormData.AmountRemaining;
        if (!isValideAmount) {
            toast.error('פרטי סכום התחייבות אינם תקינים.');
            return;
        }

        const isValidePayments = updatedFormData.NumberOfPayments - updatedFormData.PaymentsMade == updatedFormData.PaymentsRemaining;
        if (!isValidePayments) {
            toast.error('פרטי מספר התשלומים אינם תקינים.');
            return;
        }
        try {
            // שליחת נתוני הטופס לשרת
            const response = await uploadCommitment(updatedFormData);

            if (response && response.status === 200) {
                const { successfulCommitments, failedCommitments } = response.data;
                console.log(response);

                if (successfulCommitments > 0) {
                    console.log('Commitment saved successfully');
                    toast.success('ההתחייבות נוספה בהצלחה!');
                    console.log('Commitment saved successfully');
                    onSubmit(formData); // קריאה אופציונלית ל-callback onSubmit אם נדרש
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
        finally {
            onClose();
        }
    };


    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-75  z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">הוסף התחייבות</h2>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>מזהה אנש:</label>
                        <input type="text" name="AnashIdentifier" value={formData.AnashIdentifier} onChange={(e) => setFormData({ ...formData, AnashIdentifier: e.target.value })} onBlur={handleBlur} required />
                    </div>
                    <div>
                        <label>מספר זהות:</label>
                        <input className="bg-gray-200 outline-none cursor-auto" type="text" name="PersonID" value={formData.PersonID} onChange={handleChange} readOnly />
                    </div>
                    <div>
                        <label>שם:</label>
                        <input className="bg-gray-200 outline-none cursor-auto" type="text" name="FirstName" value={formData.FirstName} onChange={handleChange} readOnly />
                    </div>
                    <div>
                        <label>משפחה:</label>
                        <input className="bg-gray-200 outline-none cursor-auto" type="text" name="LastName" value={formData.LastName} onChange={handleChange} readOnly />
                    </div>
                    {!campainName&&
                    <div>
                        <label>קמפיין:</label>
                        <select name="CampainName" value={formData.CampainName} onChange={handleChange}>
                            <option value="">בחר קמפיין</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign._id} value={campaign.CampainName}>
                                    {campaign.CampainName}
                                </option>
                            ))}
                        </select>
                    </div>
                    }
                    <div>
                        <label>סכום התחייבות:</label>
                        <input type="Number" name="CommitmentAmount" value={formData.CommitmentAmount} onChange={handleChange} />
                    </div>
                    <div>
                        <label>סכום שולם:</label>
                        <input type="Number" name="AmountPaid" value={formData.AmountPaid} onChange={handleChange} />
                    </div>
                    <div>
                        <label>סכום שנותר:</label>
                        <input type="Number" name="AmountRemaining" value={formData.AmountRemaining} onChange={handleChange} />
                    </div>
                    <div>
                        <label>מספר תשלומים:</label>
                        <input type="Number" name="NumberOfPayments" value={formData.NumberOfPayments} onChange={handleChange} />
                    </div>
                    <div>
                        <label>תשלומים שבוצעו:</label>
                        <input type="Number" name="PaymentsMade" value={formData.PaymentsMade} onChange={handleChange} />
                    </div>
                    <div>
                        <label>תשלומים שנותרו:</label>
                        <input type="Number" name="PaymentsRemaining" value={formData.PaymentsRemaining} onChange={handleChange} />
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
