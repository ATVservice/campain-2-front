import React, { useState, useEffect } from 'react';
import TransactionsTable from '../components/TransactionsTable';
import { getTransactions } from '../requests/ApiRequests';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function PettyCashPage() {
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowsData, setRowsData] = useState([]);
    const [formData, setFormData] = useState({
        reason: '',
        amount: '',
        date: '',
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await getTransactions();
                const transactions = response.data.data.transactions || [];
                setRowsData(transactions);
                calculateBalance(transactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
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
        setRowsData(updatedRows);
        setBalance(currentBalance);
    };

    const handleAddExpense = (e) => {
        e.preventDefault();
        const newTransaction = {
            FullNameOrReasonForIssue: formData.reason,
            TransactionType: 'הוצאה',
            Amount: parseFloat(formData.amount),
            TransactionDate: formData.date,
        };
        const updatedTransactions = [...rowsData, newTransaction];
        setRowsData(updatedTransactions);
        calculateBalance(updatedTransactions);
        setFormData({ reason: '', amount: '', date: '' });
        closeModal();
    };

    const handleDeleteExpense = (transaction) => {
        const updatedTransactions = rowsData.filter((row) => row !== transaction);
        setRowsData(updatedTransactions);
        calculateBalance(updatedTransactions);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="text-center py-6">
            <h1 className="text-3xl font-bold mb-6">קופה קטנה</h1>

            <div className="flex flex-col items-center mb-6">
                <h2 className="text-2xl">יתרה נוכחית:</h2>
                <div className="text-4xl font-bold text-green-500 mt-2">{balance} ₪</div>
            </div>

            <button
                onClick={openModal}
                className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg hover:bg-green-600 transition duration-300"
            >
                הוסף הוצאה
            </button>

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
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
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
                <TransactionsTable rowsData={rowsData} onDelete={handleDeleteExpense} />
            )}
        </div>
    );
}

export default PettyCashPage;
