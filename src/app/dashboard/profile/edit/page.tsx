"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { GENDER_OPTIONS } from "@/constant";
import { getProfileDetails, updateProfileDetails } from "@/services/profile.service";
import { formatDateForInput } from "@/utils/formatDateForInput";
import AppLayout from "@/components/common/app-layout";
import { AxiosError } from "axios";

type UserDetails = {
    fullname: string;
    dateOfBirth: string;
    gender: string;
};

const initialState: UserDetails = {
    fullname: "",
    dateOfBirth: "",
    gender: "",
};

const EditProfileDetailsContent = () => {
    
    const [userDetails, setUserDetails] = useState<UserDetails>(initialState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {

            setLoading(true);
            try {
                
                const data = await getProfileDetails();
                
                setUserDetails({
                    fullname: data.fullname,
                    gender: data.gender,
                    dateOfBirth: formatDateForInput(data.dateOfBirth),
                });
            } catch (error) {

                if(error instanceof AxiosError) {

                    // console.error("Profile Details Fetch Failed: ", error?.response?.data.message);
                    toast.error(error?.response?.data.message);
                }
                else if (error instanceof Error) {
                    
				    // console.error("Profile Details Fetch Failed: ", error.message);
                    toast.error(error.message);
                } else {
                    
				    // console.error("Profile Details Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Saving changes...");
        try {
    
            await updateProfileDetails(userDetails);
    
            toast.success("Details updated successfully!", { id: toastId });
        } catch (error) {
            
            if(error instanceof AxiosError) {

                // console.error("Profile Updation Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message, { id: toastId });
            }
                else if (error instanceof Error) {
                    
				// console.error("Profile Updation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				// console.error("Profile Updation Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userDetails.fullname) {
        return <div className="p-8 text-center"><p>Loading...</p></div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl mx-auto">
                
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/dashboard/profile" className="p-2 rounded-full hover:bg-gray-100">
                                <ArrowLeft size={24} className="text-black" />
                            </Link>
                            <h1 className="text-3xl font-bold text-black">Edit Profile Details</h1>
                        </div>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" id="fullname" name="fullname" value={userDetails.fullname} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                </div>
                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={userDetails.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select id="gender" name="gender" value={userDetails.gender} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white" required>
                                        {GENDER_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
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

const FullEditProfilePage = () => {
    return (
        <AppLayout>
            <EditProfileDetailsContent />
        </AppLayout>
    );
};

export default FullEditProfilePage;