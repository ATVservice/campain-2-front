import React from "react";
import ReactModal from "react-modal";

function DeletedMemorialDaysModal({
    isOpen,
    onClose,
    onSubmit,
    deletedMemorialDays,
}) {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="memorial Modal"
            className="modal p-6 bg-white rounded-lg shadow-lg"
            overlayClassName="modal-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-semibold text-center mb-4">
                ימי הנצחה שימחקו
            </h2>
            <div className="flex flex-col justify-center gap-4 max-h-[98vh] overflow-y-auto">
                <table className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg overflow-hidden text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border-b">מזהה אנש</th>
                            <th className="px-4 py-2 border-b">שם פרטי</th>
                            <th className="px-4 py-2 border-b">שם משפחה</th>
                            <th className="px-4 py-2 border-b">תאריך לועזי</th>
                            <th className="px-4 py-2 border-b">תאריך עברי</th>
                        </tr>
                    </thead>

                    <tbody>
                        {deletedMemorialDays.map((memoDay) =>
                            memoDay.types.map((type) => (
                                <tr key={`${type._id}`}>
                                    <td className="px-4 py-2 border-b">
                                        {type.person.AnashIdentifier}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {type.person.FirstName}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {type.person.LastName}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {new Date (memoDay.date).toLocaleDateString('he-IL')}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {memoDay.hebrewDate}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex gap-4 mt-4">
                    <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onSubmit}>
                        אישור עריכה
                    </button>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onClose} type="button">
                        ביטול
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}

export default DeletedMemorialDaysModal;
