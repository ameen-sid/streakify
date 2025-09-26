"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Mail, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { verifyEmail } from "@/services";
import { VerificationSuccessModal } from "@/components/pages/verify-email";
import { AuthCard } from "@/components/common";
import { AxiosError } from "axios";

const VerifyEmailTokenPage = () => {

	const router = useRouter();
    const params = useParams();

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        const token = params.token as string;
        if (!token) {

            setStatus('error');
            setErrorMessage("Verification token not found.");
            return;
        }

        const onVerify = async () => {
            try {

                const response = await verifyEmail(token);
                // console.log("Verification Status: ", response);

                toast.success("Verified Successfully!");
                setStatus('success');
            } catch (error) {

                if(error instanceof AxiosError) {

                    // console.error("Verification Failed: ", error?.response?.data.message);
                    toast.error(error?.response?.data.message);
                    setErrorMessage(error?.response?.data.message);
                }
                else if (error instanceof Error) {

				    // console.error("Verification Failed: ", error.message);
                    toast.error(error.message);
                    setErrorMessage(error.message);   
                } else {

                    // console.error("Verification Failed: ", String(error));
                    toast.error("An unexpected error occurred");
                    setErrorMessage(String(error));   
                }
                setStatus('error');
            }
        };

        onVerify();
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
            <AuthCard
                icon={status === 'error' ? <AlertTriangle className="h-12 w-12" /> : <Mail className="h-12 w-12" />}
                title={
                    status === 'verifying' ? "Verifying your email..." :
                    status === 'success' ? "Verification Successful!" : "Verification Failed"
                }
            >
                <div className="mt-4 text-gray-600 max-w-xs">
                    {status === 'verifying' && <p>Please wait while we confirm your email address.</p>}
                    {status === 'success' && <p>Your account is now active. Welcome aboard!</p>}
                    {status === 'error' && <p className="text-red-600">{errorMessage}</p>}
                </div>
            </AuthCard>
            <VerificationSuccessModal isOpen={status === 'success'} />
        </>
    );
}

export default VerifyEmailTokenPage;