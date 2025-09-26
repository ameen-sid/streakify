"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { GENDER_OPTIONS } from "@/constant";
import { signUpUser } from "@/services";
import { SparkleIcon } from "@/components/icons";
import { InputField } from "@/components/pages/signup";
import { AxiosError } from "axios";

export type UserSignUpData = {
    username: string;
    email: string;
    fullname: string;
    gender: string;
    password: string;
    confirmPassword: string;
};

const initialState: UserSignUpData = {
    username: "",
    email: "",
    fullname: "",
    gender: "",
    password: "",
    confirmPassword: "",
};

const SignUp = () => {

    const router = useRouter();

	const [user, setUser] = useState<UserSignUpData>(initialState);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const onSignUp = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
		if (user.password !== user.confirmPassword) {

			toast.error("Oops! Passwords must match");
            return;
        }

		setLoading(true);
        const toastId = toast.loading("Creating an account...");
        try {

            const response = await signUpUser(user);
            // console.log("Signup Status: ", response);

            toast.success("Account Created Successfully", { id: toastId });
            setUser(initialState);

            router.push(`/signup/confirmation?email=${response.data.email}`);
        } catch(error) {

            if(error instanceof AxiosError) {

                // console.error("Axios Error: ", error?.response?.data.message);
                toast.error(error?.response?.data.message, { id: toastId });
            }
			else if (error instanceof Error) {

				// console.error("Signup Failed: ", error);
                toast.error(error.message, { id: toastId });
            } else {

				// console.error("Signup Failed: ", String(error));
                toast.error("An unexpected error occurred", { id: toastId });
            }
        } finally {
            setLoading(false);
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

					<h1 className="text-3xl font-bold text-black">Create account</h1>
					<form onSubmit={onSignUp} className="mt-8 space-y-4 text-left">

						<InputField label="Username" name="username" value={user.username} onChange={handleChange} />
                        <InputField label="Email Address" name="email" value={user.email} onChange={handleChange} type="email" />
                        <InputField label="Full Name" name="fullname" value={user.fullname} onChange={handleChange} />

						<div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select name="gender" value={user.gender} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white" required>
                                <option value="" disabled>Select gender</option>
                                {GENDER_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

						<div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type={showPassword ? "text" : "password"} name="password" value={user.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 px-4 flex items-center text-gray-500">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={user.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 px-4 flex items-center text-gray-500">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400">
                                {loading ? 'Creating Account...' : 'Create account'}
                            </button>
                        </div>

					</form>

					<p className="mt-8 text-xs text-gray-500 max-w-xs mx-auto">
                        By creating an account you agree to our{" "}
                        <Link href="/terms-and-conditions" className="font-semibold text-black hover:underline">
                            Terms and Conditions
                        </Link>
                    </p>

				</main>

			</div>
		</div>
	);
}

export default SignUp;