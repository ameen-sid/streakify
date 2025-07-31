"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle, LayoutDashboard, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { recoverAccount } from "@/services/profile.service";
import AuthCard from "@/components/common/auth-card";

const RecoverAccountPage = () => {

    const router = useRouter();
    const params = useParams();
    
    const [status, setStatus] = useState<'recovering' | 'success' | 'error'>('recovering');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const token = params.token as string;
        if (!token) {

            setStatus('error');
            setErrorMessage("Recovery token not found in the URL.");
            return;
        }

        const onRecovery = async () => {
            try {

                const response = await recoverAccount(token);
                console.log("Account Recovery Status: ", response);

                toast.success("Account Recovered Successfully!");
                setStatus('success');
            } catch (error) {
                
                if (error instanceof Error) {
                    
				    console.error("Account Recovery Failed: ", error.message);
                    toast.error(error.message);
                    setErrorMessage(error.message);
                } else {
                    
                    console.error("Account Recovery Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                    setErrorMessage(String(error));
                }
                setStatus('error');
            }
        };

        onRecovery();
    }, [params.token]);

    useEffect(() => {
        if (status === 'success') {

            const redirectTimer = setTimeout(() => {
                router.push('/dashboard');
            }, 3000);
            return () => clearTimeout(redirectTimer);
        }
    }, [status, router]);

    return (
        <>
            {status === 'recovering' && (
                <AuthCard icon={<ShieldCheck className="h-12 w-12 text-white bg-black" />} title="Recovering Your Account">
                    <p className="mt-4 text-gray-600 max-w-xs">Please wait while we restore your account access...</p>
                </AuthCard>
            )}
            {status === 'success' && (
                <AuthCard icon={<CheckCircle className="h-12 w-12 text-green-500 bg-black" />} title="Account Recovered!">
                    <p className="mt-4 text-gray-600 max-w-xs">Your account has been successfully restored. Redirecting you to the dashboard.</p>
                    <div className="mt-8 w-full">
                        <Link href="/dashboard" className="w-full inline-flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white bg-black">
                            <LayoutDashboard size={20} className="mr-2" />
                            Go to Dashboard
                        </Link>
                    </div>
                </AuthCard>
            )}
            {status === 'error' && (
                 <AuthCard icon={<AlertTriangle className="h-12 w-12 text-red-500 bg-black" />} title="Recovery Failed">
                    <p className="mt-4 text-red-600 max-w-xs">{errorMessage}</p>
                     <div className="mt-8 w-full">
                        <Link href="/login" className="w-full inline-flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white bg-black">
                            Back to Login
                        </Link>
                    </div>
                </AuthCard>
            )}
        </>
    );
};

export default RecoverAccountPage;