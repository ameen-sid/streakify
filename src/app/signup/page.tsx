"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import SparkleIcon from "@/components/icons/sparkle-icon";

const SignUp = () => {
	
    const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [user, setUser] = useState({
        username: "",
        email: "",
        fullname: "",
        gender: "",
        password: "",
        confirmPassword: "",
    });

    const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
		if (user.password !== user.confirmPassword) {
			
            toast.error("Oops! Passwords must match");
			return;
		}

        try {

            const toastId = toast.loading("Creating an account");

            const response = await axios.post("/api/v1/auth/sign-up", user);
            console.log("Signup Status: ", response);

            toast.success("Account Created Successfully", { id: toastId });

            setUser({
                username: "",
                email: "",
                fullname: "",
                gender: "",
                password: "",
                confirmPassword: "",
            });

            router.push('/signup/verify');
        } catch(error: unknown) {
            
            if(error instanceof Error)  {
                
                console.error("Signup Failed: ", error.message);
                toast.error(error.message);
            }
            else    {
                
                console.error("Signup Failed: ", String(error));
                toast.error("Unexpected error occurred");
            }
        }
    };

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col items-center text-center overflow-hidden p-8 sm:p-10">
				
				{/* Icon */}
				<div className="text-black mb-6">
					<SparkleIcon className="h-12 w-12" />
				</div>

				{/* Main Content */}
				<main className="w-full">
					<h1 className="text-3xl font-bold text-black">
						Create account
					</h1>

					<form
						onSubmit={onSignUp}
						className="mt-8 space-y-4 text-left"
                    >
                        {/* Username */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Username
							</label>
							<input
								type="text"
								value={user.username}
								onChange={(e) => setUser({...user, username: e.target.value})}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
								required
							/>
						</div>

                        {/* Email Address */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email address
							</label>
							<input
								type="email"
								value={user.email}
								onChange={(e) => setUser({...user, email: e.target.value})}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
								required
							/>
						</div>

						{/* Full Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<input
								type="text"
								value={user.fullname}
								onChange={(e) => setUser({...user, fullname: e.target.value})}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
								required
							/>
						</div>

						{/* Gender */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Gender
							</label>
							<select
								value={user.gender}
								onChange={(e) => setUser({...user, gender: e.target.value})}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
								required
                            >
								<option value="" disabled>
									Select gender
								</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
						</div>

						{/* Password */}
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								type={showPassword ? "text" : "password"}
								value={user.password}
								onChange={(e) => setUser({...user, password: e.target.value})}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 top-6 px-4 flex items-center text-gray-500">
								{showPassword ? (
									<EyeOff size={20} />
								) : (
									<Eye size={20} />
								)}
							</button>
						</div>

						{/* Confirm Password */}
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Confirm password
							</label>
							<input
								type={showConfirmPassword ? "text" : "password"}
								value={user.confirmPassword}
								onChange={(e) =>
									setUser({...user, confirmPassword: e.target.value})
								}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
								required
							/>
							<button
								type="button"
								onClick={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
								className="absolute inset-y-0 right-0 top-6 px-4 flex items-center text-gray-500">
								{showConfirmPassword ? (
									<EyeOff size={20} />
								) : (
									<Eye size={20} />
								)}
							</button>
						</div>

						{/* Create Account Button */}
						<div className="pt-4">
							<button
								type="submit"
								className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
								Create account
							</button>
						</div>
					</form>

					{/* Terms and Conditions */}
					<p className="mt-8 text-xs text-gray-500 max-w-xs mx-auto">
						By creating an account or signing you agree to our{" "}
						<Link
							href="/terms-and-conditions"
							className="font-semibold text-black hover:underline"
                        >
							Terms and Conditions
						</Link>
					</p>
				</main>
			</div>
		</div>
	);
}

export default SignUp;