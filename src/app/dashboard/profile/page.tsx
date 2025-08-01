"use client";

import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { Upload, User, Lock, Shield, ChevronRight, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { getProfile, updateAvatar } from "@/services/profile.service";
import AppLayout from "@/components/common/app-layout";
import { AxiosError } from "axios";

type UserData = {
    username: string;
    fullname: string;
    avatar: string;
};

const AvatarConfirmationModal = ({ isOpen, onClose, onConfirm, avatarPreview }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, avatarPreview: string | null }) => {
   
    if (!isOpen || !avatarPreview) return null;
    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 text-center">
                
                <h2 className="text-2xl font-bold text-black">Upload new avatar?</h2>
                <p className="mt-2 text-gray-600">This will replace your current profile picture.</p>
                <div className="my-6">
                    <img src={avatarPreview} alt="New Avatar Preview" className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-200 mx-auto" />
                </div>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="flex items-center justify-center w-full px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold">
                        <X size={20} className="mr-2" />Cancel
                    </button>
                    <button onClick={onConfirm} className="flex items-center justify-center w-full px-6 py-3 rounded-lg text-white bg-black hover:bg-gray-800 font-semibold">
                        <Check size={20} className="mr-2" />Confirm
                    </button>
                </div>

            </div>
        </div>
    );
};

const ProfileContent = () => {

    const [user, setUser] = useState<UserData | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getProfileDetails = async () => {
            try {
                const fetchedUser = await getProfile();

                setUser(fetchedUser);
                setAvatarPreview(fetchedUser.avatar);
            } catch (error) {
                
                if(error instanceof AxiosError) {

                    // console.error("Profile Fetch Failed: ", error?.response?.data.message);
                    toast.error(error?.response?.data.message);
                }
                else if (error instanceof Error) {
                    
				    // console.error("Profile Fetch Failed: ", error.message);
                    toast.error(error.message);
                } else {
                    
				    // console.error("Profile Fetch Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                }
            }
        };

        getProfileDetails();
    }, []);

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        const file = e.target.files?.[0];
        if (file) {

            setNewAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleModalClose = () => {

        setIsModalOpen(false);
        setNewAvatarFile(null);
        setAvatarPreview(user?.avatar || null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleModalConfirm = async () => {

        if (!newAvatarFile) return;
        const toastId = toast.loading("Uploading new avatar...");
        try {

            const updatedUser = await updateAvatar(newAvatarFile);

            setUser(updatedUser);
            setAvatarPreview(updatedUser.avatar);
            toast.success("Avatar updated successfully!", { id: toastId });
        } catch (error) {
            
            if(error instanceof AxiosError) {

                // console.error("Avatar Updation Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message, { id: toastId });
            }
            else if (error instanceof Error) {
                    
				// console.error("Avatar Updation Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				// console.error("Avatar Updation: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
            setAvatarPreview(user?.avatar || null); // Revert on failure
        } finally {

            setIsModalOpen(false);
            setNewAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const settingsLinks = [
        { href: '/dashboard/profile/edit', icon: User, title: 'Edit Profile Details', description: 'Update your name, date of birth, and gender.' },
        { href: '/dashboard/profile/change-password', icon: Lock, title: 'Change Password', description: 'Update your password for security.' },
        { href: '/dashboard/profile/settings', icon: Shield, title: 'Account Settings', description: 'Manage account deletion and other security settings.' },
    ];

    if (!user) {
        return <div className="flex items-center justify-center p-8"><p>Loading profile...</p></div>;
    }

    return (
        <div className="p-4 font-sans">
            <div className="w-full max-w-2xl mx-auto">
                
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        
                        <h1 className="text-3xl font-bold text-black mb-6">Profile & Settings</h1>
                        <div className="flex flex-col items-center space-y-4 py-6 border-b border-gray-200">
                            <div className="relative">
                                <img src={avatarPreview || user.avatar} alt="User Avatar" className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-200" />
                                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors">
                                    <Upload size={20} />
                                    <input ref={fileInputRef} id="avatar-upload" name="avatar" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">{user.fullname}</h2>
                                <p className="text-gray-500">@{user.username}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <ul className="space-y-2">
                                {settingsLinks.map((link) => (
                                    <li key={link.title}>
                                        <Link href={link.href} className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="bg-gray-100 p-3 rounded-full"><link.icon className="h-6 w-6 text-gray-700" /></div>
                                            <div className="ml-4 flex-grow">
                                                <p className="font-semibold text-gray-900">{link.title}</p>
                                                <p className="text-sm text-gray-500">{link.description}</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
            <AvatarConfirmationModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm} avatarPreview={avatarPreview} />
        </div>
    );
};

const FullProfilePage = () => {
    return (
        <AppLayout>
            <ProfileContent />
        </AppLayout>
    );
};

export default FullProfilePage;