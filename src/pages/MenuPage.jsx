import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import menuImage from '../images/menuImage.jpg';

const MenuPage = () => {
  // Define the animation variant
  const scaleVariant = {
    animate: {
      scale: [0.99, 0.97, 0.99], // Animate scale from 1 -> 0.95 -> 1
      transition: {
        duration: 1, // Duration for each cycle
        ease: 'easeInOut',
        repeat: Infinity, // Repeat infinitely
      },
    },
  };

  return (
    <motion.div
          className="flex flex-col justify-center items-center w-full h-full text-white font-bold text-2xl relative"
    >
      <img src={menuImage} alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
      
      {/* First Group of Links */}
      <motion.div className="flex justify-center items-center" animate="animate">
        <motion.div
          className="w-[300px] h-[150px] flex justify-center items-center bg-indigo-500/90 hover:bg-indigo-600/100 cursor-pointer rounded-sm"
          variants={scaleVariant} // Apply the variant to this container
        >
          <Link to="/alfon" className="w-full h-full flex justify-center items-center text-white">
            אלפון
          </Link>
        </motion.div>
        <motion.div
          className="w-[300px] h-[150px] flex justify-center items-center bg-indigo-500/90 hover:bg-indigo-600/100 cursor-pointer rounded-sm"
          variants={scaleVariant}
        >
          <Link to="/campains" className="w-full h-full flex justify-center items-center text-white">
            קמפיינים
          </Link>
        </motion.div>
        <motion.div
          className="w-[300px] h-[150px] flex justify-center items-center bg-indigo-500/90 hover:bg-indigo-600/100 cursor-pointer rounded-sm"
          variants={scaleVariant}
        >
          <Link to="/commitments" className="w-full h-full flex justify-center items-center text-white">
            התחייבויות ותשלומים
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Second Group of Links */}
      <motion.div className="flex justify-center items-center" animate="animate">
        <motion.div
          className="w-[300px] h-[150px] flex justify-center items-center bg-indigo-500/90 hover:bg-indigo-600/100 cursor-pointer rounded-sm"
          variants={scaleVariant}
        >
          <Link to="/report-navigation" className="w-full h-full flex justify-center items-center text-white">
            דוחות
          </Link>
        </motion.div>
        <motion.div
          className="w-[300px] h-[150px] flex justify-center items-center bg-indigo-500/90 hover:bg-indigo-600/100 cursor-pointer rounded-sm"
          variants={scaleVariant}
        >
          <Link to="/memorial-board" className="w-full h-full flex justify-center items-center text-white">
            לוח הנצחה
          </Link>
        </motion.div>
        <motion.div
          className="w-[300px] h-[150px] flex justify-center items-center bg-indigo-500/90 hover:bg-indigo-600/100 cursor-pointer rounded-sm"
          variants={scaleVariant}
        >
          <Link to="/petty-cash" className="w-full h-full flex justify-center items-center text-white">
            קופה קטנה
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
      };

export default MenuPage;
