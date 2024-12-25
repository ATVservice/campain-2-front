import React, { useState, useEffect } from "react";

// import {exportToExcel, exportToPDF} from "../../Reports/exportFilesHandler.jsx";
import { format } from "date-fns";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";

function ReportModal({reportResult,columns,columnsMappingToHebrew,onClose,onSubmit}) {


  return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center rtl z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full  h-[90vh] flex flex-col relative p-4 ">
        <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 font-bold text-lg absolute top-4 left-4 z-52"
              >
                <span className="text-2xl">x</span>
              </button>


                      <div className="flex-1 overflow-hidden w-[95%]">
                        <div className="overflow-x-auto overflow-y-auto h-full">
                          <table className="min-w-full table-auto rtl p-4">
                            <thead className={`sticky top-0 bg-gray-100`}>
                              <tr>
                                {columns?.map((column, index) => (
                                  <th key={index} className="py-2 px-2 text-center whitespace-nowrap">
                                    {columnsMappingToHebrew[column]||column}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {reportResult?.map((item, index) => (
                                  <tr key={index} className="border-t">
                                    {columns?.map((column, columnIndex) => (
                                      <td key={columnIndex} className="py-2 px-2 text-center whitespace-nowrap">
                                        {column==='Date' ? format(new Date(item[column]), 'dd/MM/yyyy') : item[column]}
                                      </td>
                                    ))}
                                  </tr>
                                  
                              ))}
                   
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6">
              <button
                className='flex flex-col gap-1 text-center items-center justify-center'
                onClick={onSubmit}
                
              >
                <RiFileExcel2Line size={24} className='text-blue-800' />
                <FaDownload size={16} className='text-blue-800 ' />
              </button>


          </div>

        </div>
      </div>
  );
}
            







export default ReportModal;
