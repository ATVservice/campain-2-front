import React from 'react';
import { Link } from 'react-router-dom';
import dollarsBackground from '../images/Dollars.jpg';

const Login = () => {
    return (
        <div
            className="flex h-screen items-start justify-center bg-gray-100"
            style={{
                backgroundImage: `url(${dollarsBackground})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg mt-16">
                <h2 className="text-2xl font-bold text-center">התחברות</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">שם משתמש</label>
                        <input id="username" name="username" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">סיסמה</label>
                        <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="text-center">
                        <Link
                            to="/menu"
                            className="w-full py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            התחבר
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
