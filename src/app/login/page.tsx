"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CircleCheck } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import SparkleIcon from "@/components/sparkle-icon-single";

const LoginPage = () => {
    
    const router = useRouter();

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [user, setUser] = useState({
        email: "", password: "",
    });

	const validateEmail = (email: string) => {
		
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		
        const newEmail = e.target.value;
		setUser({...user, email: newEmail});
		setIsEmailValid(validateEmail(newEmail));
	};

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        try {

            e.preventDefault();
            const toastId = toast.loading("Logging...");

            const response = await axios.post("/api/v1/auth/login", user);
            console.log("Login Status: ", response);
            
            toast.success("Login Successful", { id: toastId });

            setUser({
                email: "",
                password: "",
            });

            router.push("/dashboard");
        } catch(error: unknown) {

            if(error instanceof Error) {

                console.error("Login Failed: ", error.message);
                toast.error(error.message);
            } else {

                console.error("Login Failed: ", String(error));
                toast.error("Unexpected error occurred");                
            }
        }
    };

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
				
                {/* Header */}
				<div className="relative mb-8">
					<div className="absolute top-0 right-0 text-black">
						<SparkleIcon />
					</div>
					<h1 className="text-3xl font-bold">Hi, Welcome! 👋</h1>
				</div>

				{/* Form */}
				<form onSubmit={onLogin}>
					<div className="space-y-6">
						{/* Email Input */}
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
									value={user.email}
									onChange={handleEmailChange}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
									placeholder="Your email"
                                    required
								/>
								{isEmailValid && (
									<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
										<CircleCheck className="h-5 w-5 text-white bg-black rounded-full p-0.5" />
									</div>
								)}
							</div>
						</div>

						{/* Password Input */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<div className="relative">
								<input
									type={passwordVisible ? "text" : "password"}
                                    value={user.password}
                                    onChange={(e) => setUser({...user, password: e.target.value})}
									id="password"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
									placeholder="Password"
                                    required
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500">
									{passwordVisible ? (
										<EyeOff size={20} />
									) : (
										<Eye size={20} />
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Forgot Password */}
					<div className="flex items-center flex-row-reverse justify-between mt-4">
						<div className="text-sm">
							<Link
								href="forgot-password"
								className="font-medium text-gray-600 hover:text-black">
								Forgot password?
							</Link>
						</div>
					</div>

					{/* Log In Button */}
					<div className="mt-8">
						<button
							type="submit"
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
							Log in
						</button>
					</div>
				</form>

				{/* Separator
				<div className="relative my-8">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray-500">
							Or with
						</span>
					</div>
				</div> */}

				{/* Social Logins
				<div className="grid grid-cols-2 gap-4">
					<button
						type="button"
						className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
						<FacebookIcon className="h-5 w-5 mr-2" />
						Facebook
					</button>
					<button
						type="button"
						className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
						<GoogleIcon className="h-5 w-5 mr-2" />
						Google
					</button>
				</div> */}

				{/* Sign Up Link */}
				<div className="mt-8 text-center text-sm text-gray-600">
					<p>
						Don't have an account?{" "}
						<Link
							href="signup"
							className="font-medium text-black hover:underline">
							Sign up
						</Link>
					</p>
				</div>

			</div>
		</div>
	);
}

export default LoginPage;