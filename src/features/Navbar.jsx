import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { RiLogoutCircleLine } from "react-icons/ri";
import { useAuth } from '../components/AuthProvider';
import { logOut } from '../requests/ApiRequests';

const Navbar = () => {
  const { logoutUser } = useAuth();
  const location = useLocation(); // שימוש ב-useLocation כדי לבדוק את הנתיב הנוכחי

  async function LogoutUser() {
    try {
      const res = await logOut();
      if (res.status === 200) {
        logoutUser();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const isMenuPage = location.pathname === '/menu'; // בדיקה אם הנתיב הנוכחי הוא /menu

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 w-full py-4 px-8 flex items-center justify-between shadow-lg relative">
      {/* הקישורים יופיעו רק אם לא מדובר בדף menu */}
      <div className="flex gap-8">
        {!isMenuPage && (
          <>
            <Link to="/alfon" className="text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300">
              אלפון
            </Link>
            <Link to="/campains" className="text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300">
              קמפיינים
            </Link>
            <Link to="/commitment" className="text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300">
              התחייבויות ותשלומים
            </Link>
            <Link to="/reports" className="text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300">
              דוחות
            </Link>
            <Link to="/memorial-board" className="text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300">
              לוח הנצחה
            </Link>
            <Link to="/petty-cash" className="text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-110 hover:text-gray-300">
              קופה קטנה
            </Link>
          </>
        )}
      </div>

      {/* הכיתוב ברוך הבא לאתר יופיע רק בדף menu */}
      {isMenuPage && (
        <div className="absolute left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">
          ברוך הבא לאתר
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Link to="/user-profile" className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-300 transition duration-300">
          <FaUser className="text-blue-800 text-2xl" />
        </Link>
        <button onClick={LogoutUser} className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:bg-gray-300 transition duration-300">
          <RiLogoutCircleLine className="text-blue-800 text-2xl" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
