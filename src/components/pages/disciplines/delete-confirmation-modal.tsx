import React from "react";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, disciplineName }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, disciplineName: string }) => {
    
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <div className="flex items-center"><div className="bg-red-100 p-3 rounded-full mr-4"><AlertTriangle className="h-6 w-6 text-red-600" /></div><h2 className="text-2xl font-bold text-black">Delete Discipline?</h2></div>
                <p className="mt-4 text-gray-600">Are you sure you want to delete the discipline <span className="font-bold">&quot;{disciplineName}&quot;</span>? This action cannot be undone.</p>
                <div className="mt-6 flex justify-end gap-4"><button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold">Cancel</button><button onClick={onConfirm} className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold">Delete</button></div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;