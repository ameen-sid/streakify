"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Mail, User, Lock, Eye, EyeOff, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { APP_NAME } from "@/constant";
import { signUpUser } from "@/services";
import { GoogleIcon, GithubIcon } from "@/components/icons";
import { AxiosError } from "axios";

export type UserSignUpData = {
    username: string;
    email: string;
    password: string;
};

const initialState: UserSignUpData = {
    username: "",
    email: "",
    password: "",
};

const SignupPage = () => {

    const router = useRouter();

    const [user, setUser] = useState<UserSignUpData>(initialState);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    }

    const onSignUp = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Creating your account...");
        try {

            const response = await signUpUser(user);

            toast.success("Account Created Successfully", { id: toastId });
            setUser(initialState);

            router.push(`/dashboard`);
        } catch(error) {

            if(error instanceof AxiosError) toast.error(error?.response?.data.message || "An API error occurred.", { id: toastId });
            else if(error instanceof Error) toast.error(error.message, { id: toastId });
            else    toast.error("An unexpected error occurred", { id: toastId });
        } finally {
            setLoading(false);
        }
    }

	return (
		<section
			className="min-h-screen flex flex-col md:flex-row text-white font-sans"
			style={{
				background:
					"radial-gradient(circle at top left, rgba(29,78,216,0.2), transparent 40%), radial-gradient(circle at bottom right, rgba(59,130,246,0.15), transparent 40%), #0f172a",
			}}
        >

			{/* LEFT PANEL */}
			<div className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="space-y-6"
                >
					<BrainCircuit className="w-16 h-16 text-blue-500 mx-auto" />
					<h1 className="text-4xl font-bold tracking-tight">Welcome to {APP_NAME}</h1>
					<p className="text-gray-400 max-w-md mx-auto">
						Build unstoppable consistency. Track your daily streaks, stay motivated, and achieve your goals with focus.
					</p>
				</motion.div>
			</div>

			{/* RIGHT PANEL */}
			<div className="flex-grow flex items-center justify-center p-6">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-md bg-gray-900/70 border border-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
                >
					<div className="flex md:hidden justify-center items-center gap-3 mb-4">
						<BrainCircuit className="w-8 h-8 text-blue-400" />
						<span className="text-3xl font-bold">{APP_NAME}</span>
					</div>
					<h2 className="text-2xl font-bold text-center mb-2">Create your account</h2>
					<p className="text-gray-400 text-center mb-4">Let's start your consistency journey</p>

					{/* Social Logins */}
					<div className="flex sm:flex-row gap-3 justify-center">
						<button className="w-full cursor-pointer bg-gray-800/60 hover:bg-gray-700/60 transition-colors text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border border-gray-700">
							<GoogleIcon />
						</button>
						<button className="w-full cursor-pointer bg-gray-800/60 hover:bg-gray-700/60 transition-colors text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border border-gray-700">
							<GithubIcon />
						</button>
					</div>

					<div className="flex items-center gap-4 my-4">
						<div className="flex-grow border-t border-gray-700"></div>
						<span className="text-gray-500 text-sm">OR</span>
						<div className="flex-grow border-t border-gray-700"></div>
					</div>

					<form onSubmit={onSignUp} className="space-y-4">
						<div>
							<label className="block text-sm text-gray-300 mb-1">Username</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
								<input
                                    type="text" 
                                    name="username" 
                                    value={user.username} 
                                    onChange={handleChange}
                                    placeholder="Choose a username" 
                                    required
                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
							</div>
						</div>

						<div>
							<label className="block text-sm text-gray-300 mb-1">Email</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
								<input
                                    type="email" 
                                    name="email" 
                                    value={user.email} 
                                    onChange={handleChange}
                                    placeholder="you@example.com" 
                                    required
                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
							</div>
						</div>

						<div>
							<label className="block text-sm text-gray-300 mb-1">Password</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
								<input
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    value={user.password} 
                                    onChange={handleChange}
                                    placeholder="Create a password" 
                                    required
                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
								<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showPassword ? <EyeOff className="h-5 cursor-pointer w-5 text-gray-500" /> : <Eye className="h-5 cursor-pointer w-5 text-gray-500" />}
                                </button>
							</div>
						</div>

						<motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-md disabled:bg-blue-400/50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loading && <Loader className="animate-spin" size={20} />}
                            {loading ? "Creating Account..." : "Create Account"}
                        </motion.button>
					</form>

					<p className="text-center text-gray-400 text-sm mt-4">
						Already have an account?{" "}
						<Link href="/login" className="text-blue-400 hover:underline">
							Sign In
						</Link>
					</p>
				</motion.div>
			</div>
		</section>
	);
};

export default SignupPage;