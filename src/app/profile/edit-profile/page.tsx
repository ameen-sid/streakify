"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

type userDetailsType = {
	fullname: string;
	dateOfBirth: Date;
	gender: string;
}

export default function EditProfileDetailsPage() {

	const router = useRouter();
    
	const [userDetails, setUserDetails] = useState<userDetailsType | null>(null);
    const [loading, setLoading] = useState(false);

	const getEditProfileDetails = async () => {
		try {

			const response = await axios.get("/api/v1/profile/edit");
			console.log("Edit Profile Details Status: ", response);

			setUserDetails(response.data.data);
		} catch(error) {
			
			if (axios.isAxiosError(error)) {
                
				console.error("Profile Data Fetch Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to fetch data");
			} else if (error instanceof Error) {
                    
				console.error("Profile Data Fetch Failed: ", error.message);
                toast.error(error.message);
            } else {
                    
				console.error("Profile Data Fetch Failed: ", String(error));
                toast.error("An unexpected error occurred");
            }
		}
	}

	useEffect(() => {

		getEditProfileDetails();
	}, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        
		const { name, value } = e.target;
        setUserDetails(prevDetails => ({ ...prevDetails!, [name]: value }));
    };

    const OnUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        
		e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Saving user details...");

        try {
			
			const response = await axios.patch("/api/v1/profile", userDetails);
            console.log("Update Profile Status: ", response);

			toast.success("Details updated successfully!", { id: toastId });
            
			router.push("/profile");
		} catch(error) {

			if (axios.isAxiosError(error)) {
                
				console.error("Profile Data Fetch Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to fetch data", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Profile Data Fetch Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Profile Data Fetch Failed: ", String(error));
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
                            <h1 className="text-3xl font-bold text-black">Edit Profile Details</h1>
                        </div>

                        <form onSubmit={OnUpdate} className="space-y-6">
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        id="fullname"
                                        name="fullname" 
                                        value={userDetails?.fullname} 
                                        onChange={handleInputChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                        required 
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input 
                                        type="date" 
                                        id="dateOfBirth"
                                        name="dateOfBirth" 
                                        value={userDetails?.dateOfBirth instanceof Date ? userDetails.dateOfBirth.toISOString().split('T')[0] : userDetails?.dateOfBirth ? new Date(userDetails.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" 
                                        required
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select 
                                        id="gender"
                                        name="gender" 
                                        value={userDetails?.gender} 
                                        onChange={handleInputChange} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white" 
                                        required
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

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
}
