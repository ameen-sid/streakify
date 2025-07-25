"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import SparkleIcon from "@/components/sparkle-icon-single";

const ResetPasswordPage = () => {

	const router = useRouter();
	const params = useParams();
	
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const OnReset = async (e: React.FormEvent<HTMLFormElement>) => {
		
		e.preventDefault();
		setError("");
		if (newPassword !== confirmPassword) {
			
			setError("Passwords do not match.");
			return;
		}

		try {
			
			setLoading(true);
			const toastId = toast.loading("Resetting password...");

			const token = params.token;

			const response = await axios.patch("/api/v1/auth/reset-password", { newPassword, confirmPassword, token });
			console.log("Reset Password Status: ", response);

			setLoading(false);
			toast.success("Password has been reset successfully!", { id: toastId });

			router.push("/reset-password/success");
		} catch(error: unknown) {
				
			if(error instanceof Error)  {
                
                console.error("Reset Password Failed: ", error.message);
                toast.error(error.message);
            }
            else    {
                
                console.error("Reset Password Failed: ", String(error));
                toast.error("Unexpected error occurred");
            }
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden p-6 sm:p-8">
				
				{/* Header */}
				<header className="flex items-center justify-between flex-row-reverse">
					<div className="text-black">
						<SparkleIcon />
					</div>
				</header>

				{/* Main Content */}
				<main className="py-8 flex-grow flex flex-col">
					<h1 className="text-3xl font-bold text-black">
						Reset password
					</h1>
					<p className="mt-2 text-gray-600">
						Please type something you'll remember.
					</p>

					<form onSubmit={OnReset} className="mt-8 space-y-6">
						{/* New Password Input */}
						<div>
							<label
								htmlFor="new-password"
								className="block text-sm font-medium text-gray-700 mb-1">
								New password
							</label>
							<div className="relative">
								<input
									type={showNewPassword ? "text" : "password"}
									id="new-password"
									value={newPassword}
									onChange={(e) =>
										setNewPassword(e.target.value)
									}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
									placeholder="must be 8 characters"
									required
								/>
								<button
									type="button"
									onClick={() =>
										setShowNewPassword(!showNewPassword)
									}
									className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
									{showNewPassword ? (
										<EyeOff size={20} />
									) : (
										<Eye size={20} />
									)}
								</button>
							</div>
						</div>

						{/* Confirm New Password Input */}
						<div>
							<label
								htmlFor="confirm-password"
								className="block text-sm font-medium text-gray-700 mb-1">
								Confirm new password
							</label>
							<div className="relative">
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									id="confirm-password"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
									placeholder="repeat password"
									required
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
									className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
									{showConfirmPassword ? (
										<EyeOff size={20} />
									) : (
										<Eye size={20} />
									)}
								</button>
							</div>
						</div>

						{error && (
							<p className="text-sm text-red-600">{error}</p>
						)}

						<div>
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400">
								{loading ? "Resetting..." : "Reset password"}
							</button>
						</div>
					</form>
				</main>

				{/* Footer Link */}
				<footer className="text-center text-sm text-gray-600 mt-auto pt-4">
					<p>
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-black hover:underline">
							Log in
						</Link>
					</p>
				</footer>

			</div>
		</div>
	);
};

export default ResetPasswordPage;