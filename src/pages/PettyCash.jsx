import React, { useState, useEffect, useRef } from 'react';
import TransactionsTable from '../components/TransactionsTable';
import { getTransactions, addExpense } from '../requests/ApiRequests';
import Modal from 'react-modal';
import Spinner from '../components/Spinner';
import { exportToExcel, exportToPDF } from "../../Reports/exportFilesHandler.jsx";
import {englishToHebrewPPettyCashMapping} from '../components//Utils.js'



Modal.setAppElement('#root');

function PettyCashPage() {
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowsData, setRowsData] = useState([]);
    const [formData, setFormData] = useState({
        reason: '',
        amount: '',
        date: new Date(),
    });
    const [isLoading, setIsLoading] = useState(false);
    const gridRef = useRef(null);
    

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const response = await getTransactions();
            const transactions = response.data.data.transactions || [];
            calculateBalance(transactions); // מעדכן את היתרה לפי הטרנזקציות שהתקבלו
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // קריאה לפונקציה בתוך useEffect כשיוזר נכנס לעמוד בפעם הראשונה
        fetchTransactions();
    }, []);

    const calculateBalance = (data) => {
        let currentBalance = 0;
        const updatedRows = data.map((transaction) => {
            currentBalance = transaction.TransactionType === 'הכנסה'
                ? currentBalance + transaction.Amount
                : currentBalance - transaction.Amount;
            return { ...transaction, currentBalance }; // נוסיף יתרה נוכחית לכל שורה
        });
        const reversedRows = updatedRows.reverse();

    setRowsData(reversedRows);
    setBalance(currentBalance);
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const newExpense = {
            FullNameOrReasonForIssue: formData.reason,
            TransactionType: 'הוצאה',
            Amount: parseFloat(formData.amount),
            TransactionDate: formData.date,
        };
        try{
            const addedExpense= await addExpense(newExpense);
            console.log(addedExpense);
            
            fetchTransactions();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
        setFormData({ reason: '', amount: '', date: new Date() });
        closeModal();     
    };

    

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const getCurrentGridData = () => {
        if(!gridRef.current || !gridRef.current.api) return 
    
        const columnOrder = gridRef.current.api
          .getColumnDefs().filter((colDef) => colDef.cellDataType
          !== false)
          .map((colDef) => colDef.field);
          console.log(columnOrder);
          
        const rowData = [];
        console.log(gridRef.current.api);
    
        gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
          rowData.push(node.data);
          
          // Convert Map back to an object with ordered keys
        });
    
        return { rowData, columnOrder };
      };
            const handelExportToExcel = () => {
      
          const data = getCurrentGridData();
          exportToExcel(data.rowData,data.columnOrder,englishToHebrewPPettyCashMapping, 'קופה קטנה');
        }
          
        const handelExportToPdf = () => {
          const data = getCurrentGridData();
          exportToPDF(data.rowData,data.columnOrder,englishToHebrewPPettyCashMapping, 'קופה קטנה');
        }
      
    
    if(isLoading)
        return <Spinner/>

    return (
        <div className="text-center py-6">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={openModal}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg hover:bg-green-600 transition duration-300 mr-4"
                >
                    הוסף הוצאה
                </button>
                <div className="flex-grow flex justify-center items-center">
                    <h2 className="text-3xl mr-2">יתרה נוכחית:</h2>
                    <div
                        className={`text-3xl font-bold ${
                            balance >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                        style={{ direction: 'ltr' }}
                    >
                        {balance < 0 && '-'}
                        {Math.abs(balance)} ₪
                    </div>
                    
                </div>
                <div className="flex gap-4 mr-auto ml-2">
            <button type='button' className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded'
              onClick={handelExportToExcel}
              >
              יצוא דו"ח EXCEL
            </button>
            <button type='button' className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded  '
              onClick={handelExportToPdf}
              >
              יצוא דו"ח PDF
            </button>
          </div>

                
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="הוסף הוצאה"
                className="bg-white p-6 rounded-lg max-w-lg mx-auto"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
            >
                <h2 className="text-2xl mb-4">הוסף הוצאה</h2>
                <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">סיבת הוצאה:</label>
                        <input
                            type="text"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">סכום:</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">תאריך:</label>
                        <input
                            type="date"
                            value={formData.date.toISOString().split('T')[0]|| ''}
                            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 gap-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            שמור
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                        >
                            ביטול
                        </button>
                    </div>
                </form>
            </Modal>

            {rowsData.length > 0 && (
                <TransactionsTable rowsData={rowsData} fetchTransactions={fetchTransactions} gridRef={gridRef}/>
            )}
        </div>
    );
}

export default PettyCashPage;
