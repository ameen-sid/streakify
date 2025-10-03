"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { SimpleHeader, SimpleFooter } from "@/components/common";

const ResetPasswordSuccessPage = () => {

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
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">Password Reset Successful</h1>
                            <p className="text-gray-400 mb-8">
                                Your password has been updated. You can now log in with your new password.
                            </p>
                            <Link href="/login" className="cursor-pointer">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                                    Back to Login <ArrowRight size={18} />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </main>
                <SimpleFooter />
            </div>
        </div>
        
    );
}

export default ResetPasswordSuccessPage;