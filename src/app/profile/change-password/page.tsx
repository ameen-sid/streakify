"use client";

import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

type PasswordsType = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const ChangePasswordPage = () => {
    
	const [passwords, setPasswords] = useState<PasswordsType | null>(null);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev!, [name]: value }));
        setError('');
        setSuccess('');
    };

	type PasswordField = 'current' | 'new' | 'confirm';
    
    const toggleShowPassword = (field: PasswordField) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        
		e.preventDefault();
        setError('');
        setSuccess('');

        if (passwords!.newPassword !== passwords!.confirmPassword) {
            
			setError('New passwords do not match.');
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Updating password...");
		try {

			const response = await axios.patch("/api/v1/profile/password", passwords);
			console.log("Password Change Status: ", response);

			setLoading(false);
			setSuccess("Password updated successfully!");
			setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
			
			toast.success("Password updated successfully", { id: toastId });
		} catch(error) {

			if (axios.isAxiosError(error)) {
                
				console.error("Password Change Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to change password", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Password Change Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Password Change Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
		}
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center font-sans">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    
					<div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <a href="/profile" className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </a>
                            <h1 className="text-3xl font-bold text-black">Change Password</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-6">
                                {/* Current Password */}
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword.current ? 'text' : 'password'} 
                                            id="currentPassword"
                                            name="currentPassword" 
                                            value={passwords?.currentPassword} 
                                            onChange={handleInputChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                            required 
                                        />
                                        <button type="button" onClick={() => toggleShowPassword('current')} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
                                            {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword.new ? 'text' : 'password'} 
                                            id="newPassword"
                                            name="newPassword" 
                                            value={passwords?.newPassword} 
                                            onChange={handleInputChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                            required 
                                        />
                                        <button type="button" onClick={() => toggleShowPassword('new')} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
                                            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword.confirm ? 'text' : 'password'} 
                                            id="confirmPassword"
                                            name="confirmPassword" 
                                            value={passwords?.confirmPassword} 
                                            onChange={handleInputChange} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                            required 
                                        />
                                        <button type="button" onClick={() => toggleShowPassword('confirm')} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
                                            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Error and Success Messages */}
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            {success && <p className="text-sm text-green-600">{success}</p>}


                            {/* Save Button */}
                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                                >
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

export default ChangePasswordPage;