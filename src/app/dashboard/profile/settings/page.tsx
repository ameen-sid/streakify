"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { deleteAccount } from "@/services/profile.service";
import AppLayout from "@/components/common/app-layout";
import { AxiosError } from "axios";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => {
    
    const [confirmText, setConfirmText] = useState('');
    const isConfirmEnabled = confirmText === 'DELETE';
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                
                <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Are you sure?</h2>
                </div>

                <p className="mt-4 text-gray-600">
                    Your account will be scheduled for deletion. You have 30 days to recover it. After that, all data, including disciplines and progress, will be permanently deleted.
                </p>

                <div className="mt-6">
                    <label htmlFor="confirm-delete" className="block text-sm font-medium text-gray-700">
                        To confirm, please type &quot;DELETE&quot; in the box below.
                    </label>
                    <input
                        type="text"
                        id="confirm-delete"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={!isConfirmEnabled} className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold disabled:bg-red-300 disabled:cursor-not-allowed">
                        Delete Account
                    </button>
                </div>

            </div>
        </div>
    );
};

const AccountSettingsContent = () => {
    
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAccountDeletion = async () => {
        
        const toastId = toast.loading("Scheduling account for deletion...");
        try {
            
            await deleteAccount();

            toast.success("Account deletion scheduled.", { id: toastId });
            router.push("/dashboard/profile/settings/deletion-confirmation");
        } catch (error) {
            
            if(error instanceof AxiosError) {

                // console.error("Account Deletion Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message, { id: toastId });
            }
            else if (error instanceof Error) {
                    
				// console.error("Account Deletion Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                
			    // console.error("Account Deletion Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl mx-auto">
                
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/dashboard/profile" className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </Link>
                            <h1 className="text-3xl font-bold text-black">Account Settings</h1>
                        </div>
                        <div className="border-2 border-red-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-red-800">Delete Account</h2>
                            <p className="mt-2 text-gray-600">
                                Once you delete your account, it will be scheduled for deletion. You&apos;ll have 30 days to recover it. After that, all your data will be permanently erased. Please proceed only if you're sure.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 font-semibold"
                                >
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleAccountDeletion}
            />
        </div>
    );
};

const FullAccountSettingsPage = () => {
    return (
        <AppLayout>
            <AccountSettingsContent />
        </AppLayout>
    );
};

export default FullAccountSettingsPage;