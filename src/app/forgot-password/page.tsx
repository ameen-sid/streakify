"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, KeyRound, ArrowLeft, Loader, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { sendResetPasswordToken } from "@/services";
import { AxiosError } from "axios";
import { SimpleFooter, SimpleHeader } from "@/components/common";

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {

        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsEmailValid(validateEmail(newEmail));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (!isEmailValid) return;

        setLoading(true);
        const toastId = toast.loading("Sending password reset link...");
        try {

            await sendResetPasswordToken(email);

            toast.success("Reset link sent successfully!", { id: toastId });
            setSubmitted(true);
        } catch (error) {

            if (error instanceof AxiosError) {
                toast.error(error?.response?.data.message || "An error occurred.", { id: toastId });
            } else if (error instanceof Error) {
                toast.error(error.message, { id: toastId });
            } else {
                toast.error("An unexpected error occurred.", { id: toastId });
            }
        } finally {
            setLoading(false);
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
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="max-w-md mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl"
                    >
                        {!submitted ? (
                            <>
                                <div className="flex justify-center mb-6">
                                    <KeyRound className="w-16 h-16 text-blue-500" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-4">Forgot Your Password?</h1>
                                <p className="text-gray-400 mb-8">
                                    Don't worry! It happens. Enter the email address associated with your account.
                                </p>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="sr-only">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                placeholder="Enter your email"
                                                required
                                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-10 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            {isEmailValid && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !isEmailValid}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center mb-6">
                                    <CheckCircle className="w-16 h-16 text-green-500" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-4">Check Your Inbox</h1>
                                <p className="text-gray-400">
                                    A password reset link has been sent to{' '}
                                    <span className="font-semibold text-blue-400">{email}</span>.
                                    Please check your email to proceed.
                                </p>
                            </>
                        )}

                        <div className="mt-8 pt-6  cursor-pointer border-t border-gray-800 w-full">
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
    );
}

export default ForgotPasswordPage;