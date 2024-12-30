import React from 'react'
import { useNavigate } from 'react-router-dom'
import ReportCommitments from './ReportCommitments'

function ReportNavigation() {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col grow justify-center items-center bg-indigo-100 '>

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

    </div>
  )
}

export default ReportNavigation