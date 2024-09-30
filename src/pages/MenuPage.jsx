import React from 'react';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  return (
    <div className="min-h-screen flex flex-wrap items-start justify-evenly p-6 bg-gray-900 ">
      <Link
        to="/alfon"
        className="bg-gray-800 text-white text-center p-16 mx-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl w-full md:w-1/3 lg:w-1/4 text-2xl font-semibold tracking-wide border border-gray-700 hover:border-gray-500"
      >
        אלפון
      </Link>
      <Link
        to="/campains"
        className="bg-gray-800 text-white text-center p-16 mx-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl w-full md:w-1/3 lg:w-1/4 text-2xl font-semibold tracking-wide border border-gray-700 hover:border-gray-500"
      >
        קמפיינים
      </Link>
      <Link
        to="/commitment"
        className="bg-gray-800 text-white text-center p-16 mx-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl h-40 w-full md:w-1/3 lg:w-1/4 text-2xl font-semibold tracking-wide border border-gray-700 hover:border-gray-500"
      >
        התחייבויות ותשלומים
      </Link>
      <Link
        to="/reports"
        className="bg-gray-800 text-white text-center p-16 mx-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl w-full md:w-1/3 lg:w-1/4 text-2xl font-semibold tracking-wide border border-gray-700 hover:border-gray-500"
      >
        דוחות
      </Link>
      <Link
        to="/memorial-board"
        className="bg-gray-800 text-white text-center p-16 mx-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl w-full md:w-1/3 lg:w-1/4 text-2xl font-semibold tracking-wide border border-gray-700 hover:border-gray-500"
      >
        לוח הנצחה
      </Link>
      <Link
        to="/petty-cash"
        className="bg-gray-800 text-white text-center p-16 mx-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl w-full md:w-1/3 lg:w-1/4 text-2xl font-semibold tracking-wide border border-gray-700 hover:border-gray-500"
      >
        קופה קטנה
      </Link>
    </div>
  );
  };

export default MenuPage;
