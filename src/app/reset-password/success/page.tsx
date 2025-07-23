"use client";

import React from "react";
import Link from "next/link";

const SparkleIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		width="32"
		height="32"
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
		<path
			d="M18 8L16.5 5.5 14 4l2.5-1.5L18 0l1.5 2.5L22 4l-2.5 1.5L18 8z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

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