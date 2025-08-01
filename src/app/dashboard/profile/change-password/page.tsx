"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { changePassword } from "@/services/profile.service";
import AppLayout from "@/components/common/app-layout";
import PasswordInputField from "@/components/pages/change-password/password-input-field";
import { AxiosError } from "axios";

export type PasswordsType = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const initialState: PasswordsType = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const ChangePasswordContent = () => {

    const router = useRouter();
    
    const [passwords, setPasswords] = useState<PasswordsType>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
       
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        setError('');

        if (passwords.newPassword !== passwords.confirmPassword) {
        
            setError('New passwords do not match.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Updating password...");
        try {

            await changePassword(passwords);

            toast.success("Password updated successfully!", { id: toastId });
            setPasswords(initialState);

            router.push("/dashboard/profile");
        } catch (error) {
            
            if(error instanceof AxiosError) {

                // console.error("Password Updation Failed: ", error?.response?.data.message);
                // toast.error(error?.response?.data.message, { id: toastId });
                setError(error?.response?.data.message);
            }
            else if (error instanceof Error) {
                    
				// console.error("Password Updation Failed: ", error.message);
                // toast.error(error.message, { id: toastId });
                setError(error.message);
            } else {
                    
			    // console.error("Password Updation Failed: ", String(error));
                // toast.error("An unexpected error occurred", { id: toastId });
                setError(String(error));
            }
        } finally {
            setLoading(false);
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
                            <h1 className="text-3xl font-bold text-black">Change Password</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <PasswordInputField label="Current Password" name="currentPassword" value={passwords.currentPassword} onChange={handleInputChange} />
                                <PasswordInputField label="New Password" name="newPassword" value={passwords.newPassword} onChange={handleInputChange} />
                                <PasswordInputField label="Confirm New Password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleInputChange} />
                            </div>
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                            <div className="pt-6">
                                <button type="submit" disabled={loading} className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

const FullChangePasswordPage = () => {
    return (
        <AppLayout>
            <ChangePasswordContent />
        </AppLayout>
    );
};

export default FullChangePasswordPage;