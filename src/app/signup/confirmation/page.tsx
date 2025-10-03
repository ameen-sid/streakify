"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MailCheck, ArrowLeft, Loader } from "lucide-react";
import { SimpleHeader, SimpleFooter } from "@/components/common";
import { VerifyEmailContent } from "@/components/pages/signup-confirmation";

const SignupConfirmationPage = () => {

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div
            className="bg-gray-950 text-white font-sans antialiased min-h-screen flex flex-col"
            style={{
                backgroundImage: `
                radial-gradient(circle at top left, rgba(29, 78, 216, 0.1), transparent 40%),
                radial-gradient(circle at top right, rgba(29, 78, 216, 0.1), transparent 40%),
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px) `,
                backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
            }}>
            <div className="flex flex-col flex-grow">
                <SimpleHeader />
                <main className="flex-grow flex items-center justify-center">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className="max-w-md mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl"
                        >
                            <div className="flex justify-center mb-6">
                                <MailCheck className="w-16 h-16 text-blue-500" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">Check Your Inbox</h1>
                            <div className="min-h-[120px]">
                                <Suspense fallback={
                                    <div className="flex justify-center items-center h-full">
                                        <Loader className="w-8 h-8 text-gray-500 animate-spin" />
                                    </div>
                                }>
                                    <VerifyEmailContent />
                                </Suspense>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-800 w-full">
                                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <SimpleFooter />
            </div>
        </div>
    );
};

export default SignupConfirmationPage;