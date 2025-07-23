"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Mail, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const VerificationSuccessModal = ({ isOpen }: { isOpen: boolean }) => {
    
	if (!isOpen) return null;

    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
       
		if (countdown > 0) {
            
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-xs z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8 text-center">
                <div className="mx-auto bg-green-100 h-16 w-16 flex items-center justify-center rounded-full">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-black mt-6">You are verified!</h2>
                <p className="mt-2 text-gray-600">
                    Redirecting you to your dashboard in {countdown}...
                </p>
            </div>
        </div>
    );
};

const VerifyEmailTokenPage = () => {

	const router = useRouter();
    const params = useParams();
	
	const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        
		if (isVerified) {
            
			const redirectTimer = setTimeout(() => {
				router.push('/dashboard');
            }, 3000);

            return () => clearTimeout(redirectTimer);
        }
    }, [isVerified]);

    const OnVerify = async () => {
        try {

			setLoading(true);
			const toastId = toast.loading("Verifying token...");

			const token = params.token;

			const response = await axios.post("/api/v1/auth/verify", { token });
			console.log("Verificaiton Status: ", response);

			setLoading(false);
			setIsVerified(true);
			toast.success("Verified Successfully", { id: toastId });
		} catch(error: unknown) {

            if(error instanceof Error)  {
                
                console.error("Verification Failed: ", error.message);
                toast.error(error.message);
            }
            else    {
                
                console.error("Verification Failed: ", String(error));
                toast.error("Unexpected error occurred");
            }
		}
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col items-center text-center overflow-hidden p-8 sm:p-12">
                    
                    {/* Icon */}
                    <div className="bg-black text-white p-4 rounded-full mb-6">
                        <Mail className="h-12 w-12" />
                    </div>

                    {/* Main Content */}
                    <main className="flex-grow flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-black">Almost there!</h1>
                        <p className="mt-4 text-gray-600 max-w-xs">
                            Click the button below to finalize your account verification.
                        </p>

                        {/* Verify Button */}
                        <div className="mt-8 w-full">
                            <button
                                onClick={OnVerify}
                                disabled={loading || isVerified}
                                className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify Account'}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
            <VerificationSuccessModal isOpen={isVerified} />
        </>
    );
}

export default VerifyEmailTokenPage;