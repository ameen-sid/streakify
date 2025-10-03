"use client";

import React, { useState, ReactNode } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldQuestion, Loader, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { recoverAccount } from "@/services";
import { SimpleHeader, SimpleFooter } from "@/components/common";
import { AxiosError } from "axios";

const StatusCard = ({ icon, title, message, children }: { icon: ReactNode, title: string, message: string, children?: ReactNode }) => {

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
            <div className="flex justify-center mb-6">{icon}</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-400 mb-8 min-h-[48px]">{message}</p>
            {children}
        </motion.div>
    );
};

const RecoverAccountPage = () => {

    const params = useParams();
    const router = useRouter();

    const [status, setStatus] = useState('confirming'); // 'confirming', 'recovering', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleRecovery = async () => {

        setStatus('recovering');
        const token = params.token as string;
        const toastId = toast.loading("Recovering your account...");
        try {

            await recoverAccount(token);

            toast.success("Account recovered successfully!", { id: toastId });
            setStatus('success');
            router.push('/dashboard');
        } catch (error) {

            const message = error instanceof AxiosError ? error.response?.data.message : "An API error occurred.";
            toast.error(message, { id: toastId });
            setErrorMessage(message);
            setStatus('error');
        }
    };

    const renderContent = () => {

        switch (status) {
            case 'recovering':
                return <StatusCard icon={<Loader className="w-16 h-16 text-blue-500 animate-spin" />} title="Recovering Account..." message="Please wait while we restore your account data." />;
            case 'success':
                return (
                    <StatusCard
                        icon={<CheckCircle className="w-16 h-16 text-green-500" />}
                        title="Account Recovered!"
                        message="Your account has been successfully restored. You can now log in."
                    >
                        <Link href="/login">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                                Proceed to Login <ArrowRight size={18} />
                            </button>
                        </Link>
                    </StatusCard>
                );
            case 'error':
                return (
                    <StatusCard
                        icon={<AlertTriangle className="w-16 h-16 text-red-500" />}
                        title="Recovery Failed"
                        message={errorMessage || "This recovery link is invalid or has expired."}
                    >
                        <Link href="/login">
                            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg">
                                Back to Login
                            </button>
                        </Link>
                    </StatusCard>
                );
            case 'confirming':
            default:
                return (
                    <StatusCard
                        icon={<ShieldQuestion className="w-16 h-16 text-blue-500" />}
                        title="Confirm Account Recovery"
                        message="You have requested to recover your account. Clicking 'Recover' will cancel its scheduled deletion. Are you sure you want to proceed?"
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/login" className="w-full">
                                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg">
                                    Cancel
                                </button>
                            </Link>
                            <button
                                onClick={handleRecovery}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
                            >
                                Yes, Recover My Account
                            </button>
                        </div>
                    </StatusCard>
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
            <SimpleFooter />
        </div>
    );
};

export default RecoverAccountPage;