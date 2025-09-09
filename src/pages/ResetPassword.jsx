import React, { useState } from 'react';
import axios from 'axios';
import { useParams ,useNavigate} from 'react-router-dom'; // Assuming you're using React Router for navigation
import { resetPassword } from '../requests/ApiRequests';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Disable interactions
        console.log(typeof token, typeof newPassword);
        try {
            const response = await resetPassword(token, newPassword);

            toast.success('Password reset successful! Redirecting to login...', {
                autoClose: 2000, // Close toast after 2 seconds
                onClose: () => navigate('/login'), // Navigate after toast closes
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false); // Re-enable interactions
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
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Reset Password</h2>
                
                <input 
                    type="password" 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required
                    className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
    
                <button 
                    type="submit" 
                    disabled={loading} 
                    className={`w-full py-3 font-semibold rounded-lg transition duration-300 ${
                        loading 
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                            : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    {loading ? "Loading..." : "Reset Password"}
                </button>
    
                {message && (
                    <p className="text-center mt-4 text-green-600">{message}</p>
                )}
            </form>
        </div>
    );
    };


export default ResetPassword;
