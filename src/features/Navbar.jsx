import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-burgundy w-full py-4 px-6 flex items-center justify-between">
      <div className="text-white text-xl font-semibold flex-1 text-center">
        ברוך הבא לאתר
      </div>
      <div>
        <Link to="/personal-area" className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-burgundy">
          <FaUser className="text-2xl" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
