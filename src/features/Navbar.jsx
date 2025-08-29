import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const Navbar = () => {
  const { logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMenuPage = location.pathname === '/menu';

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);

  function LogoutUser() {
    try {
      logoutUser();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // set initial state
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
  className={`sticky inset-x-0 top-0 z-50 h-16 px-8 flex items-center justify-between shadow-lg
              transition-all duration-300
              ${scrolled ? 'bg-indigo-800/90' : 'bg-indigo-800/95'}`}
    >
      {/* Burger button for mobile */}
      <button
        className="md:hidden text-white text-3xl"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      {/* Center title for menu page */}
      {isMenuPage && (
        <div className="absolute left-1/2 -translate-x-1/2 text-white text-xl md:text-3xl font-bold">
          {/* ברוך הבא לאתר */}
        </div>
      )}

      {/* Main links - responsive */}
      <div
        className={`absolute md:static top-full left-0 w-full md:w-auto 
                    ${scrolled ? 'bg-blue-800/100 backdrop-blur-lg' : 'bg-indigo-800'}
                    md:bg-transparent flex-col md:flex-row flex md:flex md:gap-8
                    items-center px-4 md:px-0 py-4 md:py-0 transition-all duration-300 ease-in-out
                    ${isOpen ? 'flex' : 'hidden'}`}
      >
        {!isMenuPage && (
          <>

              <Link to="/alfon" className="text-white text-lg font-semibold hover:text-gray-300 px-2">
                אלפון
              </Link>
              <Link to="/campains" className="text-white text-lg font-semibold hover:text-gray-300">
                קמפיינים
              </Link>
              <Link to="/commitments" className="text-white text-lg font-semibold hover:text-gray-300">
                התחייבויות ותשלומים
              </Link>
              <Link to="/report-navigation" className="text-white text-lg font-semibold hover:text-gray-300">
                דוחות
              </Link>
              <Link to="/memorial-board" className="text-white text-lg font-semibold hover:text-gray-300">
                לוח הנצחה
              </Link>
              <Link to="/petty-cash" className="text-white text-lg font-semibold hover:text-gray-300 px-2">
                קופה קטנה
              </Link>
          </>
        )}
      </div>

      {/* User icons */}
      <div className="flex gap-4">
        <Link
          to="/user-profile"
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-300 transition"
        >
          <FaUser className="text-blue-800 text-xl" />
        </Link>
        <button
          onClick={LogoutUser}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-300 transition"
        >
          <RiLogoutCircleLine className="text-blue-800 text-xl" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
