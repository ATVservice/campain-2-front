import React, { useState } from 'react';
import axios from 'axios';
import { forgotPassword } from '../requests/ApiRequests';
import Spinner from '../components/Spinner';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await forgotPassword({ username, email });

            console.log(response);
            if(response.status == 200) {
                setMessage('לינק ליצירת סיסמה נשלח לאימייל');
            }
        } catch (error) {
            setMessage(error.response.data.message);
        }
        finally {
            setLoading(false);
        }
    };
    if(loading) {
        return <Spinner />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">יצירת סיסמה חדשה</h2>
                
                <input 
                    type="text" 
                    placeholder="שם משתמש במערכת"  
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
    
                <input 
                    type="email" 
                    placeholder="אימייל לשחזור סיסמה" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
    
                <button 
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    אישור
                </button>
    
                {message && (
                    <p className="text-center mt-4 text-green-600">{message}</p>
                )}
            </form>
        </div>
    );
    };

export default ForgotPassword;
