import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserDetails } from '../requests/ApiRequests';

function UserDetailsPage() {
    const { anashIdentifier } = useParams();
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserDetails(anashIdentifier);
                console.log(response.data.data.userDetails);
                setUserDetails(response.data.data.userDetails);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [anashIdentifier]);

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">פרטים מלאים</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700">שם פרטי</label>
                    <input
                        type="text"
                        value={userDetails.FirstName || ''}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-gray-700">שם משפחה</label>
                    <input
                        type="text"
                        value={userDetails.LastName || ''}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Address</label>
                    <textarea
                        value={userDetails.Address || ''}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                </div>
            </form>
        </div>
    );
}

export default UserDetailsPage;
