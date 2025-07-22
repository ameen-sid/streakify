"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

const VerifyEmail = () => {
	
    const [otp, setOtp] = useState(["", "", "", "", ""]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const [canResend, setCanResend] = useState(false);
	
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	// Countdown timer logic
	useEffect(() => {

		if (countdown > 0) {

			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [countdown]);

	const OnVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {

		e.preventDefault();
		setLoading(true);
		const enteredOtp = otp.join("");
		const toastId = toast.loading("Verifying OTP");

		// --- This is where you would call your backend API ---
		const response = await axios.post('/api/v1/auth/sign-up', { otp });
		console.log("OTP Verification Status: ", response);

		toast.success("OTP Verified Successfully", { id: toastId });

		const CORRECT_OTP = "12345";

		// Simulate network delay
		setTimeout(() => {

			if (enteredOtp !== CORRECT_OTP || enteredOtp.length < 5) {
				
                setError("Wrong code, please try again");
			} else {
				
                setError("");
				alert("Success! Code is correct.");
				// Navigate to the next page
			}
			setLoading(false);
		}, 1000);
	};

	const OnResendCode = async () => {

		if (canResend) {

			const toastId = toast.loading("Resending code...");
			
			setCountdown(60);
			setCanResend(false);
			setError("");
			setOtp(["", "", "", "", ""]);
			inputRefs.current[0]?.focus();

			const response = await axios.post('/api/v1/auth/otp/resend', { otp });
			console.log("OTP Status: ", response);

			toast.success("Code Resend Successfully", { id: toastId });
		}
	};

	const handleInputChange = (index: number, value: string) => {
		
        // Only allow a single digit
		if (!/^\d?$/.test(value)) return;

		setError(""); // Clear error on new input
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Focus next input if a digit is entered
		if (value && index < otp.length - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		
        // Move to previous input on backspace if current is empty
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden">
				
				{/* Header */}
				<header className="p-6 flex items-center justify-between">
					<Link href="sign-up">
                        <button className="p-2 rounded-full hover:bg-gray-100">
						    <ArrowLeft size={24} className="text-black" />
					    </button>
                    </Link>
					<div className="text-black">
						<SparkleIcon />
					</div>
				</header>

				{/* Main Content */}
				<form
					onSubmit={OnVerifyCode}
					className="px-6 py-8 flex-grow flex flex-col"
                >
					<h1 className="text-3xl font-bold text-black">
						Enter code
					</h1>
					<p className="mt-2 text-gray-600">
						We've sent an activation code to your email.
					</p>

					{/* OTP Input Fields */}
					<div className="flex justify-between gap-2 sm:gap-4 my-8">
						{otp.map((value, index) => (
							<input
								key={index}
								ref={(el) => {inputRefs.current[index] = el}}
								type="tel"
								maxLength={1}
								value={value}
								onChange={(e) =>
									handleInputChange(index, e.target.value)
								}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className={`w-14 h-16 sm:w-16 sm:h-20 bg-white border-2 rounded-xl text-center text-3xl font-semibold transition-colors focus:outline-none focus:ring-0 ${
									error
										? "border-red-500"
										: "border-gray-300 focus:border-black"
								}`}
							/>
						))}
					</div>

					{/* Error Message */}
					{error && (
						<p className="text-center text-red-500 text-sm">
							{error}
						</p>
					)}

					{/* Verify Button */}
					<div className="mt-8">
						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400">
							{loading ? "Verifying..." : "Verify"}
						</button>
					</div>

					{/* Resend Code */}
					<div className="text-center mt-6 flex-grow flex items-end justify-center">
						<button
							type="button"
							onClick={OnResendCode}
							disabled={!canResend}
							className={`font-semibold ${
								canResend
									? "text-black"
									: "text-gray-400 cursor-not-allowed"
							}`}>
							Send code again
						</button>
						{!canResend && (
							<span className="ml-2 text-gray-500 font-mono">
								00:{countdown.toString().padStart(2, "0")}
							</span>
						)}
					</div>
				</form>

			</div>
		</div>
	);
}

export default VerifyEmail;