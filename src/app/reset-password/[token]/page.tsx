"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { KeyRound, ArrowLeft, Loader, CheckCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from "react-hot-toast";
import { resetPassword } from "@/services";
import { SimpleHeader, SimpleFooter } from "@/components/common";
import { AxiosError } from "axios";

export type PasswordData = {
    newPassword: string;
    confirmPassword: string;
};

const initialState: PasswordData = {
    newPassword: "",
    confirmPassword: "",
};

const initialShowState = {
    newPassword: false,
    confirmPassword: false,
};

const ResetPasswordPage = () => {

    const router = useRouter();
	const params = useParams();

    const [passwords, setPasswords] = useState<PasswordData>(initialState);
    const [showPassword, setShowPassword] = useState(initialShowState);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const doPasswordsMatch = passwords.newPassword && passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword;
    const isPasswordComplex = passwords.newPassword.length >= 8;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setError("");
        if (!isPasswordComplex) {

            toast.error("Password must be at least 8 characters long.");
            return;
        }
        if (!doPasswordsMatch) {

            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Resetting your password...");
        try {

            const token = params.token as string;
            await resetPassword({ ...passwords, token });

            toast.success("Password reset successfully!", { id: toastId });
            setSubmitted(true);
            router.push("/reset-password/success");
        } catch(error) {

            if(error instanceof AxiosError) {

                toast.error(error?.response?.data.message, { id: toastId });
                setError(error?.response?.data.message);
            }
			else if(error instanceof Error) {

                toast.error(error.message, { id: toastId });
                setError(error.message);
            }
            else {

                toast.error("Unexpected error occurred", { id: toastId });
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

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
                                <h1 className="text-2xl md:text-3xl font-bold mb-4">Reset Your Password</h1>
                                <p className="text-gray-400 mb-8">
                                    Please type something you'll remember.
                                </p>
                                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                    <div>
                                        <label htmlFor="newPassword"  className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.newPassword ? 'text' : 'password'}
                                                id="newPassword"
                                                name="newPassword"
                                                value={passwords.newPassword}
                                                onChange={handleChange}
                                                placeholder="Must be at least 8 characters"
                                                required
                                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-4 pr-10 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <button type="button" onClick={() => setShowPassword({...showPassword, newPassword: !showPassword.newPassword})} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                {showPassword.newPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword"  className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.confirmPassword ? 'text' : 'password'}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={passwords.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Repeat password"
                                                required
                                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-4 pr-10 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <button type="button" onClick={() => setShowPassword({...showPassword, confirmPassword: !showPassword.confirmPassword})} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                {showPassword.confirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                            </button>
                                        </div>
                                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                                    >
                                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center mb-6">
                                    <CheckCircle className="w-16 h-16 text-green-500" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-4">Password Reset Successful</h1>
                                <p className="text-gray-400 mb-8">
                                    Your password has been updated. You can now log in with your new password.
                                </p>
                                <Link href="/login">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                                        Back to Login <ArrowRight size={18} />
                                    </button>
                                </Link>
                            </>
                        )}
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
    );
}

export default ResetPasswordPage;