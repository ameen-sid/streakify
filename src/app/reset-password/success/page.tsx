"use client";

import React from "react";
import Link from "next/link";
import SparkleIcon from "@/components/icons/sparkle-icon";

const PasswordChangeConfirmationPage = () => {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-sm bg-white rounded-3xl shadow-lg flex flex-col items-center text-center overflow-hidden p-8 sm:p-12">
				
                {/* Icon */}
				<div className="text-black mb-6">
					<SparkleIcon className="h-12 w-12" />
				</div>

				{/* Main Content */}
				<main className="flex-grow flex flex-col items-center">
					<h1 className="text-3xl font-bold text-black">
						Password changed
					</h1>
					<p className="mt-2 text-gray-600 max-w-xs">
						Your password has been changed successfully
					</p>

					{/* Back to Login Button */}
					<div className="mt-8 w-full">
						<Link
							href="/login"
							className="w-full block justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
							Back to login
						</Link>
					</div>
				</main>
                
			</div>
		</div>
	);
};

export default PasswordChangeConfirmationPage;