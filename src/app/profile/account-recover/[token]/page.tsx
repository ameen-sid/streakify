"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const RecoverAccountPage = () => {

	const params = useParams();
    
	const [loading, setLoading] = useState(false);
    const [isRecovered, setIsRecovered] = useState(false);

    const OnRecovery = async () => {

        setLoading(true);
        const token = params.token;
        const toastId = toast.loading("Recovering account...");
		try {

			const response = await axios.post("/api/v1/profile/account/recover", { token });
			console.log("Account Recovery Status: ", response);
			
			setLoading(false);
			setIsRecovered(true);

			toast.success("Account Recovered Successfully", { id: toastId });
		} catch(error) {

			if (axios.isAxiosError(error)) {
                
				console.error("Account Recovery Failed: ", error.message);
                toast.error(error.response?.data?.message || "Failed to recover account", { id: toastId });
			} else if (error instanceof Error) {
                    
				console.error("Account Recovery Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {
                    
				console.error("Account Recovery Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
		}
        
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col items-center text-center overflow-hidden p-8 sm:p-12">
                
                {isRecovered ? (
                    <>
                        {/* Success State */}
                        <div className="bg-green-100 text-green-700 p-4 rounded-full mb-6">
                            <CheckCircle className="h-12 w-12" />
                        </div>
                        <main className="flex-grow flex flex-col items-center">
                            <h1 className="text-3xl font-bold text-black">Account Recovered!</h1>
                            <p className="mt-4 text-gray-600 max-w-xs">
                                Your account has been successfully restored. The scheduled deletion has been cancelled.
                            </p>
                            <div className="mt-8 w-full">
                                <Link
                                    href="/dashboard"
                                    className="w-full inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                >
                                    <LayoutDashboard size={20} className="mr-2" />
                                    Go to Dashboard
                                </Link>
                            </div>
                        </main>
                    </>
                ) : (
                    <>
                        {/* Initial State */}
                        <div className="bg-black text-white p-4 rounded-full mb-6">
                            <ShieldCheck className="h-12 w-12" />
                        </div>
                        <main className="flex-grow flex flex-col items-center">
                            <h1 className="text-3xl font-bold text-black">Recover Your Account</h1>
                            <p className="mt-4 text-gray-600 max-w-xs">
                                Clicking the button below will cancel the scheduled deletion of your account and restore your access.
                            </p>
                            <div className="mt-8 w-full">
                                <button
                                    onClick={OnRecovery}
                                    disabled={loading}
                                    className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                                >
                                    {loading ? 'Recovering...' : 'Recover My Account'}
                                </button>
                            </div>
                        </main>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecoverAccountPage;