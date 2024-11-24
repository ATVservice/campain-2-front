import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Spinner from './Spinner';

function InvalidUploads({ invalidUploads, errorUploads,succesCount ,existingCount,newCount}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        contentLabel="Invalid Uploads"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-right rtl relative max-h-[98vh] overflow-y-auto">
          <h2 className='text-xl font-semibold mb-2'>העלאות עדכון תקינות:   {existingCount}</h2>
          <h2 className='text-xl font-semibold mb-2'> העלאות חדשות תקינות:  {newCount}   </h2>
          <h2 className='text-xl font-semibold mb-2'>סה"כ העלאות תקינות  {succesCount}</h2>
          
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
           סה"כ העלאות לא תקינות: {invalidUploads.length}
          </h2>

          <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b">מזהה אנש</th>
                <th className="px-4 py-2 border-b">שם פרטי</th>
                <th className="px-4 py-2 border-b">שם משפחה</th>
              </tr>
            </thead>
            <tbody>
              {invalidUploads.map((person, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-center">{person.AnashIdentifier || 'חסר ערך'}</td>
                  <td className="px-4 py-2 text-center">{person.FirstName || 'חסר ערך'}</td>
                  <td className="px-4 py-2 text-center">{person.LastName || 'חסר ערך'}</td>
                </tr>
              ))}
              {errorUploads.map((person, index) => (
                <tr key={index} className="border-b border-gray-200 bg-red-50">
                  <td colSpan={3} className="px-4 py-2 text-center text-red-600 font-medium">
                    {person.AnashIdentifier}: שגיאה בהעלאה
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out"
            onClick={() => {
              invalidUploads.splice(0, invalidUploads.length);
              errorUploads.splice(0, errorUploads.length);
              setIsModalOpen(false);
              window.location.reload();
            }}
          >
            סגור
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default InvalidUploads;
