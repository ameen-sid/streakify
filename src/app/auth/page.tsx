"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Mail, User, Lock, Eye, EyeOff, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { APP_NAME } from "@/constant";
import { GoogleIcon, GithubIcon } from "@/components/icons";

export type UserAuthData = {
	username: string;
	email: string;
	password: string;
};

const initialState: UserAuthData = {
	username: "",
	email: "",
	password: "",
};

const UnifiedAuthPage = () => {

	const router = useRouter();

	const [authMode, setAuthMode] = useState("signup");
	const [user, setUser] = useState<UserAuthData>(initialState);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const formVariants = {
		hidden: { opacity: 0, scale: 0.98, y: 10 },
		visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

		const { name, value } = e.target;
		setUser(prevUser => ({ ...prevUser, [name]: value }));
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

		e.preventDefault();
		setLoading(true);

		const action = authMode;
		const toastId = toast.loading(action === 'signup' ? "Creating your account..." : "Signing you in...");
		try {

			const result = await signIn("credentials", {
				redirect: false,
				username: user.username,
				email: user.email,
				password: user.password,
				action: action,
			});

			if(result?.error) {
				toast.error(result.error, { id: toastId });
			}
			else {

				toast.success(action === 'signup' ? "Account Created Successfully!" : "Signed In Successfully!", { id: toastId });
				router.push('/dashboard');
			}
		} catch (error) {
			toast.error("An unexpected error occurred.", { id: toastId });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div
			className="min-h-screen flex flex-col md:flex-row text-white font-sans"
			style={{ background: "radial-gradient(circle at top left, rgba(29,78,216,0.2), transparent 40%), radial-gradient(circle at bottom right, rgba(59,130,246,0.15), transparent 40%), #0f172a" }}
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
						Build unstoppable consistency. Track your daily streaks,
						stay motivated, and achieve your goals with focus.
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

					{/* TABS for Sign In / Sign Up with Animation */}
					<div className="relative flex bg-gray-800/60 p-1 rounded-lg mb-6">
						<motion.div
							className="absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-md"
							layoutId="active-tab-indicator"
							initial={false}
							animate={{
								x: authMode === "signup" ? "0%" : "100%",
							}}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 30,
							}}
						/>
						<button
							onClick={() => setAuthMode("signup")}
							className={`relative w-1/2 py-2 text-sm cursor-pointer font-semibold transition-colors ${
								authMode === "signup"
									? "text-white"
									: "text-gray-400 hover:text-white"
							}`}>
							Create Account
						</button>
						<button
							onClick={() => setAuthMode("signin")}
							className={`relative w-1/2 py-2 text-sm cursor-pointer font-semibold transition-colors ${
								authMode === "signin"
									? "text-white"
									: "text-gray-400 hover:text-white"
							}`}>
							Sign In
						</button>
					</div>

					<div className="flex flex-row gap-3">
						<button 
							onClick={() => signIn('google', { callbackUrl: '/dashboard' })} 
							className="w-full cursor-pointer bg-gray-800/60 hover:bg-gray-700/60 transition-colors text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border border-gray-700"
						>
							<GoogleIcon />
						</button>
						<button 
							onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
							className="w-full cursor-pointer bg-gray-800/60 hover:bg-gray-700/60 transition-colors text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border border-gray-700"
						>
							<GithubIcon />
						</button>
					</div>

					<div className="flex items-center gap-4 my-4">
						<div className="flex-grow border-t border-gray-700"></div>
						<span className="text-gray-500 text-sm">OR</span>
						<div className="flex-grow border-t border-gray-700"></div>
					</div>

					<AnimatePresence mode="wait">
						<motion.form 
							key={authMode} 
							onSubmit={handleSubmit} 
							initial="hidden" 
							animate="visible" 
							exit="hidden" 
							variants={formVariants} 
							className="space-y-4"
						>
							<AnimatePresence>
								{authMode === "signup" && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
									>
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
									</motion.div>
								)}
							</AnimatePresence>

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
								<div className="flex justify-between items-center mb-1">
									<label className="block text-sm text-gray-300">Password</label>
									{authMode === "signin" && (
										<Link
											href="/forgot-password"
											className="text-xs text-blue-400 hover:underline">
											Forgot Password?
										</Link>
									)}
								</div>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
									<input
										type={showPassword ? "text" : "password"}
										name="password" 
										value={user.password} 
										onChange={handleChange} 
										placeholder="Enter your password"
										required
										className="w-full bg-gray-800/60 border border-gray-700 rounded-lg pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
										{showPassword ? (
											<EyeOff className="h-5 w-5 text-gray-500" />
										) : (
											<Eye className="h-5 w-5 text-gray-500" />
										)}
									</button>
								</div>
							</div>

							<motion.button 
								type="submit" 
								disabled={loading} 
								whileHover={{ scale: 1.03 }} 
								whileTap={{ scale: 0.97 }} 
								className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-lg shadow-md !mt-6 disabled:bg-blue-400/50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
							>
								{loading && <Loader className="animate-spin" size={20} />}
								{loading ? (authMode === 'signup' ? 'Creating Account...' : 'Signing In...') : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
							</motion.button>
						</motion.form>
					</AnimatePresence>
				</motion.div>
			</div>
		</div>
	);
};

export default UnifiedAuthPage;