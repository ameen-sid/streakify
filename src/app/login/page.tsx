"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CircleCheck } from "lucide-react";
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

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		fill="currentColor"
		viewBox="0 0 16 16"
		height="1em"
		width="1em"
		{...props}
    >
		<path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.604 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
	</svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		fill="currentColor"
		viewBox="0 0 48 48"
		height="1em"
		width="1em"
		{...props}
    >
		<path
			fill="#FFC107"
			d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
		/>
		<path
			fill="#FF3D00"
			d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
		/>
		<path
			fill="#4CAF50"
			d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
		/>
		<path
			fill="#1976D2"
			d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.572 36.846 48 30.828 48 24c0-1.341-.138-2.65-.389-3.917z"
		/>
	</svg>
);

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