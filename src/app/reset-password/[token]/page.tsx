"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { resetPassword } from "@/services/auth.service";
import SparkleIcon from "@/components/icons/sparkle-icon-single";
import PasswordInputField from "@/components/pages/reset-password/password-input-field";

export type PasswordData = {
    newPassword: string;
    confirmPassword: string;
};

const initialState: PasswordData = {
    newPassword: "",
    confirmPassword: "",
};

const ResetPasswordPage = () => {

	const router = useRouter();
	const params = useParams();
	
	const [passwords, setPasswords] = useState<PasswordData>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        
		const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        setError("");
    };

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		
		e.preventDefault();
		setError("");
		if (passwords.newPassword !== passwords.confirmPassword) {
         
			setError("Passwords do not match.");
            return;
        }

		setLoading(true);
        const toastId = toast.loading("Resetting password...");
        try {
			
			const token = params.token as string;

			const response = await resetPassword({ ...passwords, token });
			console.log("Reset Password Status: ", response);

            toast.success("Password has been reset successfully!", { id: toastId });
            router.push("/reset-password/success");
		} catch(error) {
				
			if(error instanceof Error)  {
                
                console.error("Reset Password Failed: ", error.message);
                toast.error(error.message);
            }
            else    {
                
                console.error("Reset Password Failed: ", String(error));
                toast.error("Unexpected error occurred");
            }
		} finally {
            setLoading(false);
        }
	};

	return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden p-6 sm:p-8">
                
                <header className="flex items-center justify-end">
                    <div className="text-black">
                        <SparkleIcon />
                    </div>
                </header>
                
                <main className="py-8 flex-grow flex flex-col">
                    <h1 className="text-3xl font-bold text-black">Reset password</h1>
                    <p className="mt-2 text-gray-600">Please type something you'll remember.</p>
                    <form onSubmit={onSubmit} className="mt-8 space-y-6">
                        <PasswordInputField
                            label="New password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            placeholder="must be 8 characters"
                        />
                        <PasswordInputField
                            label="Confirm new password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            placeholder="repeat password"
                        />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                            >
                                {loading ? "Resetting..." : "Reset password"}
                            </button>
                        </div>
                    </form>
                </main>
                
                <footer className="text-center text-sm text-gray-600 mt-auto pt-4">
                    <p>
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-black hover:underline">
                            Log in
                        </Link>
                    </p>
                </footer>
                
            </div>
        </div>
    );
};

export default ResetPasswordPage;