"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser } from "@/services/auth.service";
import SparkleIcon from "@/components/icons/sparkle-icon-single";

type Credentials = {
    email: string;
    password: string;
};

const initialState: Credentials = {
    email: "",
    password: "",
};

const LoginPage = () => {
    
    const router = useRouter();

	const [credentials, setCredentials] = useState<Credentials>(initialState);
    const [loading, setLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const validateEmail = (email: string): boolean => {
        
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        
		const { name, value } = e.target;
        if (name === "email") {
            setIsEmailValid(validateEmail(value));
        }
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

	const onLogin = async (e: FormEvent<HTMLFormElement>) => {

		e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Logging in...");
        try {

            const response = await loginUser(credentials);
            console.log("Login Status: ", response);

            toast.success("Login Successful", { id: toastId });
            setCredentials(initialState);

            router.push("/dashboard");
        } catch(error) {

            if(error instanceof Error) {

                console.error("Login Failed: ", error.message);
                toast.error(error.message, { id: toastId });
            } else {

                console.error("Login Failed: ", String(error));
                toast.error("Unexpected error occurred", { id: toastId });                
            }
        } finally {
            setLoading(false);
        }
    };

	return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
                
                <div className="relative mb-8">
                    <div className="absolute top-0 right-0 text-black">
                        <SparkleIcon />
                    </div>
                    <h1 className="text-3xl font-bold">Hi, Welcome! 👋</h1>
                </div>

                <form onSubmit={onLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Your email"
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500"
                            >
                                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="text-right text-sm">
                        <Link href="/forgot-password" className="font-medium text-gray-600 hover:text-black">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-black hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
                
            </div>
        </div>
    );
}

export default LoginPage;