"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		{...props}
    >
		<path
			d="M12 2L9.44 9.44 2 12l7.44 2.56L12 22l2.56-7.44L22 12l-7.44-2.56L12 2z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const ForgotPasswordPage = () => {
	
	const [email, setEmail] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const validateEmail = (email: string) => {

		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		
        const newEmail = e.target.value;
		setEmail(newEmail);
		setIsEmailValid(validateEmail(newEmail));
	};

	const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		
        e.preventDefault();
		if (!isEmailValid) return;
		try {

			setLoading(true);
			const toastId = toast.loading("Sending password reset email...");

			const response = await axios.post("/api/v1/auth/reset-password/token", { email });
			console.log("Forgot Password Email Status: ", response);

			setLoading(false);
			setSubmitted(true);
			toast.success("Email Sent Successfully", { id: toastId });
		} catch(error: unknown) {

			if(error instanceof Error) {

                console.error("Forgot Password Email Failed: ", error.message);
                toast.error(error.message);
            } else {

                console.error("Forgot Password Email Failed: ", String(error));
                toast.error("Unexpected error occurred");                
            }
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden p-6 sm:p-8">
				
				{/* Header */}
				<header className="flex items-center justify-between">
					<Link href="login">
						<button className="p-2 cursor-pointer rounded-full hover:bg-gray-100">
							<ArrowLeft size={24} className="text-black" />
						</button>
					</Link>
					<div className="text-black">
						<SparkleIcon />
					</div>
				</header>

				{/* Main Content */}
				<main className="py-8 flex-grow flex flex-col">
					<h1 className="text-3xl font-bold text-black">
						Forgot password?
					</h1>
					<p className="mt-2 text-gray-600">
						Don't worry! It happens. Please enter the email address
						associated with your account.
					</p>

					{submitted ? (
						<div className="mt-8 text-center bg-green-50 p-4 rounded-lg">
							<p className="text-green-800">
								If an account with that email exists, a password
								reset code has been sent.
							</p>
						</div>
					) : (
						<form
							onSubmit={OnSubmit}
							className="mt-8 space-y-6"
						>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1">
									Email address
								</label>
								<div className="relative">
									<input
										type="email"
										id="email"
										value={email}
										onChange={handleEmailChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
										placeholder="Enter your email address"
										required
									/>
									{isEmailValid && (
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<CheckCircle className="h-5 w-5 text-white bg-black rounded-full p-0.5" />
										</div>
									)}
								</div>
							</div>

							<div>
								<button
									type="submit"
									disabled={loading || !isEmailValid}
									className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed">
									{loading ? "Sending..." : "Send code"}
								</button>
							</div>
						</form>
					)}
				</main>

				{/* Footer Link */}
				<footer className="text-center text-sm text-gray-600 mt-auto pt-4">
					<p>
						Remember password?{" "}
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
}

export default ForgotPasswordPage;