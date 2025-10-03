"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, BrainCircuit, CheckCircle, AlertTriangle, Loader, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { verifyEmail } from "@/services";
// import { VerificationSuccessModal } from "@/components/pages/verify-email";
// import { AuthCard } from "@/components/common";
import { AxiosError } from "axios";
import { APP_NAME } from "@/constant";

const SimpleHeader = () => (

    <header className="py-6">
        <div className="container mx-auto px-6 flex justify-center">
            <div className="flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
            </div>
        </div>
    </header>
);

const VerificationCard = ({ icon, title, message, actionButton = null, actionForm = null }: { icon: ReactNode, title: string, message: string, actionButton?: ReactNode | null, actionForm?: ReactNode | null }) => {

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="max-w-md mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl"
        >
            <div className="flex justify-center mb-6">
                {icon}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-400 mb-8 min-h-[48px]">{message}</p>
            {actionButton}
            {actionForm}
        </motion.div>
    );
};

const VerifyEmailPage = () => {

    const params = useParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying'); // 'verifying', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [emailForResend, setEmailForResend] = useState('');
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {

        const token = params.token as string;
        if (!token) {

            setStatus('error');
            setErrorMessage("Verification token not found or is invalid.");
            return;
        }

        const onVerify = async () => {
            try {

                await verifyEmail(token);

                toast.success("Email verified successfully!");
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
            }, 3000); // Redirect after 3 seconds
            return () => clearTimeout(redirectTimer);
        }
    }, [status, router]);

    const handleResend = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (!emailForResend) {

            toast.error("Please enter your email address.");
            return;
        }
        setIsResending(true);

        try {

            // const response = await resendVerificationEmail(emailForResend);
            // toast.success(response.message || "A new verification link has been sent.");
        } catch (error) {

            if(error instanceof AxiosError) {

                // console.error("Verification Failed: ", error?.response?.data.message);
                toast.error(error?.response?.data.message);
            }
            else if (error instanceof Error) {

			    // console.error("Verification Failed: ", error.message);
                toast.error(error.message);
            } else {

                // console.error("Verification Failed: ", String(error));
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsResending(false);
        }
    };

    const renderContent = () => {

        switch (status) {
            case 'success':
                return (
                    <VerificationCard
                        icon={<CheckCircle className="w-16 h-16 text-green-500" />}
                        title="Verification Successful"
                        message="Your email has been verified. Redirecting you to the dashboard..."
                        actionButton={
                            <button onClick={() => router.push('/dashboard')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                                Go to Dashboard <ArrowRight size={18} />
                            </button>
                        }
                    />
                );
            case 'error':
                return (
                    <VerificationCard
                        icon={<AlertTriangle className="w-16 h-16 text-red-500" />}
                        title="Verification Failed"
                        message={errorMessage}
                        actionForm={
                            <form onSubmit={handleResend} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="sr-only">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={emailForResend}
                                        onChange={(e) => setEmailForResend(e.target.value)}
                                        placeholder="Enter your email to resend link"
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isResending}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isResending ? <Loader className="w-5 h-5 animate-spin" /> : <Mail size={18} />}
                                    {isResending ? 'Sending...' : 'Resend Verification Link'}
                                </button>
                            </form>
                        }
                    />
                );
            default: // 'verifying'
                return (
                    <VerificationCard
                        icon={<Loader className="w-16 h-16 text-blue-500 animate-spin" />}
                        title="Verifying Your Email..."
                        message="Please wait a moment while we confirm your email address."
                    />
                );
        }
    };

    return (
        <div className="bg-gray-950 text-white font-sans antialiased min-h-screen flex flex-col"
            style={{
                backgroundImage: `
                radial-gradient(circle at top left, rgba(29, 78, 216, 0.1), transparent 40%),
                radial-gradient(circle at top right, rgba(29, 78, 216, 0.1), transparent 40%),
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px) `,
                backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
            }}
        >
            <SimpleHeader />
            <main className="flex-grow flex items-center justify-center">
                <div className="container mx-auto px-6">
                    {renderContent()}
                </div>
            </main>
            <footer className="py-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Streakify. All rights reserved.
            </footer>
        </div>
    );
}

// const VerifyEmailTokenPage = () => {

// 	// const router = useRouter();
//     // const params = useParams();

//     // const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
//     // const [errorMessage, setErrorMessage] = useState('');

//     // useEffect(() => {

//         // const token = params.token as string;
//         // if (!token) {

//         //     setStatus('error');
//         //     setErrorMessage("Verification token not found.");
//         //     return;
//         // }

//         // const onVerify = async () => {
//         //     try {

//         //         const response = await verifyEmail(token);
//                 // console.log("Verification Status: ", response);

//             //     toast.success("Verified Successfully!");
//             //     setStatus('success');
//             // } catch (error) {

//         //         if(error instanceof AxiosError) {

//         //             // console.error("Verification Failed: ", error?.response?.data.message);
//         //             toast.error(error?.response?.data.message);
//         //             setErrorMessage(error?.response?.data.message);
//         //         }
//         //         else if (error instanceof Error) {

// 		// 		    // console.error("Verification Failed: ", error.message);
//         //             toast.error(error.message);
//         //             setErrorMessage(error.message);   
//         //         } else {

//         //             // console.error("Verification Failed: ", String(error));
//         //             toast.error("An unexpected error occurred");
//         //             setErrorMessage(String(error));   
//         //         }
//         //         setStatus('error');
//         //     }
//         // };

//         // onVerify();
//     // }, [params.token]);

//     // useEffect(() => {
//     //     if (status === 'success') {

//     //         const redirectTimer = setTimeout(() => {
//     //             router.push('/dashboard');
//     //         }, 3000);
//     //         return () => clearTimeout(redirectTimer);
//     //     }
//     // }, [status, router]);

// //     return (
// //         <>
// //             <AuthCard
// //                 icon={status === 'error' ? <AlertTriangle className="h-12 w-12" /> : <Mail className="h-12 w-12" />}
// //                 title={
// //                     status === 'verifying' ? "Verifying your email..." :
// //                     status === 'success' ? "Verification Successful!" : "Verification Failed"
// //                 }
// //             >
// //                 <div className="mt-4 text-gray-600 max-w-xs">
// //                     {status === 'verifying' && <p>Please wait while we confirm your email address.</p>}
// //                     {status === 'success' && <p>Your account is now active. Welcome aboard!</p>}
// //                     {status === 'error' && <p className="text-red-600">{errorMessage}</p>}
// //                 </div>
// //             </AuthCard>
// //             <VerificationSuccessModal isOpen={status === 'success'} />
// //         </>
// //     );
// }

export default VerifyEmailPage;