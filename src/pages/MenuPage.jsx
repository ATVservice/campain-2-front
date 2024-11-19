import React from 'react';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  return (
    <div className="min-h-screen flex flex-wrap items-start justify-center p-4 gap-y-2">
      <Link
        to="/alfon"
        className="bg-blue-200 text-blue-900 text-center p-16 mx-2 rounded-lg shadow-md hover:bg-blue-300 transition-all w-full md:w-1/3 lg:w-1/4 text-2xl"
      >
        אלפון
      </Link>
      <Link
        to="/campains"
        className="bg-blue-200 text-blue-900 text-center p-16 mx-2 rounded-lg shadow-md hover:bg-blue-300 transition-all w-full md:w-1/3 lg:w-1/4 text-2xl"
      >
        קמפיינים
      </Link>
      <Link
        to="/commitments"
        className="bg-blue-200 text-blue-900 text-center p-14 mx-2 rounded-lg shadow-md hover:bg-blue-300 transition-all h-40 w-full md:w-1/3 lg:w-1/4 text-2xl"
      >
        התחייבויות ותשלומים
      </Link>
      <Link
        to="/reports"
        className="bg-blue-200 text-blue-900 text-center p-16 mx-2 rounded-lg shadow-md hover:bg-blue-300 transition-all w-full md:w-1/3 lg:w-1/4 text-2xl"
      >
        דוחות
      </Link>
      <Link
        to="/memorial-board"
        className="bg-blue-200 text-blue-900 text-center p-16 mx-2 rounded-lg shadow-md hover:bg-blue-300 transition-all w-full md:w-1/3 lg:w-1/4 text-2xl"
      >
        לוח הנצחה
      </Link>
      <Link
        to="/petty-cash"
        className="bg-blue-200 text-blue-900 text-center p-16 mx-2 rounded-lg shadow-md hover:bg-blue-300 transition-all w-full md:w-1/3 lg:w-1/4 text-2xl"
      >
        קופה קטנה
      </Link>
    </div>
  );
};

export default MenuPage;
