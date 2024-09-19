import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-blue-800 w-full py-4 px-8 flex items-center justify-between shadow-lg">
      <div className="flex-1"></div> {/* רווח כדי לשמור על הכיתוב במרכז */}
      <div className="text-white text-2xl font-semibold text-center">
        ברוך הבא לאתר
      </div>
      <div className="flex-1 flex justify-end">
        <Link to="/personal-area" className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-300 transition duration-300">
          <FaUser className="text-blue-800 text-2xl" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
