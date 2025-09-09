import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function ReportNavigation() {
    const navigate = useNavigate();
  return (
    <motion.div className='flex flex-col grow justify-center items-center h-[100vh]'>

        <section className='flex justify-center items-center gap-4 h-[100%]'>
            <button className='bg-indigo-500 p-2 w-[100px] h-[100px]  rounded-sm text-white text-center align-middle'
            onClick={() => navigate('/report-commitments')}
            >
                דו"ח התחייבויות
            </button>
            <button className='bg-indigo-500 p-2 w-[100px] h-[100px]  rounded-sm text-white text-center align-middle'
            onClick={() => navigate(`/report-payments?filter=campainName`)}

            
            >
               דו"ח תשלומים לפי קמפיין
            </button>
            <button className='bg-indigo-500 p-2 w-[100px] h-[100px]  rounded-sm text-white text-center align-middle'
            onClick={() => navigate(`/report-payments?filter=dateRange`)}
            
            >
               דו"ח תשלומים לפי טווח תאריכים
            </button>

        </section>

    </motion.div>
  )
}

export default ReportNavigation