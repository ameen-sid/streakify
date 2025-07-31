"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrainCircuit, LogOut, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { APP_NAME, APP_NAVIGATION_LINKS } from "@/constant";
import { getProfile } from "@/services/profile.service";
import { logoutUser } from "@/services/auth.service";

type UserData = {
    fullname: string;
    avatar: string;
};

const Header = ({ onMenuClick, user }: { onMenuClick: () => void, user: UserData }) => {
    return (
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm lg:hidden">
            <button type="button" className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none lg:hidden" onClick={onMenuClick}>
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
                <div className="flex-1 flex">
                    <BrainCircuit className="h-8 w-8 text-black" />
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                    <img className="h-8 w-8 rounded-full" src={user.avatar} alt="User Avatar" />
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen, user, date }: { sidebarOpen: boolean, setSidebarOpen: (open: boolean) => void, user: UserData, date: string }) => {

    const router = useRouter();

    const onLogOut = async () => {

        const toastId = toast.loading("Logging out...");
        try {

            await logoutUser();

            toast.success("Logged Out", { id: toastId });

            router.push("/");
        } catch(error) {

            if (error instanceof Error) {
                    
				console.error("Log out Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
			    console.error("Log out Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        }
    }

    const SidebarContent = () => (
        <>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                    <BrainCircuit className="h-8 w-8 text-black" />
                    <span className="ml-3 text-xl font-bold">{APP_NAME}</span>
                </div>
                <div className="mt-8 px-4">
                    <div className="flex items-center gap-3">
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="User Avatar" />
                        <div>
                            <p className="font-bold text-black">{user.fullname}</p>
                        </div>
                    </div>
                </div>
                <nav className="mt-6 px-2 space-y-1">
                    {APP_NAVIGATION_LINKS.map((item) => (
                        <Link key={item.name} href={typeof item.href === "function" ? item.href(date) : item.href} className="text-gray-600 hover:bg-gray-100 hover:text-black group flex items-center px-2 py-2 text-base font-medium rounded-md">
                            <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button onClick={onLogOut} className="w-full flex-shrink-0 cursor-pointer group block">
                    <div className="flex items-center">
                        <div><LogOut className="inline-block h-9 w-9 text-gray-500"/></div>
                        <div className="ml-3"><p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Log Out</p></div>
                    </div>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`} role="dialog" aria-modal="true">
                <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2"><button type="button" className={`ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)}><X className="h-6 w-6 text-white" /></button></div>
                    <SidebarContent />
                </div>
            </div>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 bg-white">
                <SidebarContent />
            </div>
        </>
    );
};

const AppLayout = ({ children }: { children: ReactNode }) => {
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {

        const fetchUser = async () => {
            try {
                
                const userData = await getProfile();
                
                setUser(userData);
            } catch (error) {
                
                if (error instanceof Error) {
				    console.error("Profile Fetch Failed: ", error.message);
                } else {
				    console.error("Profile Fetch Failed: ", String(error));
                }
            }
        };
        
        fetchUser();
    }, []);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center"><p>Loading User...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} date={today} />
            <div className="lg:pl-64 flex flex-col flex-1">
                <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
                <main className="flex-1 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;