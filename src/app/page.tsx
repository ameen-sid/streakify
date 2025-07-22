"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
		viewBox="0 0 200 200"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		{...props}
    >
		<path
			d="M85 145C65 145 50 130 50 110C50 90 65 75 85 75"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M85 75C105 75 115 90 115 110C115 130 105 145 85 145"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M85 110H115"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M100 75V55"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M70 92.5H85"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M115 92.5H130"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M70 127.5H85"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M115 127.5H130"
			stroke="black"
			strokeWidth="8"
			strokeLinecap="round"
		/>
		<path
			d="M115 45L135 65L165 35"
			stroke="black"
			strokeWidth="10"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
		/>
	</svg>
);

const AiTag = () => (
    <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-800 ring-1 ring-inset ring-purple-200 mt-2 sm:mt-0">
		<Zap className="h-4 w-4 mr-2 text-purple-600" />
		AI-Powered
	</div>
);

const Home = () => {
	return (
		<div className="min-h-screen bg-white text-black font-sans">
			<div className="container mx-auto px-4 h-screen">
				<div className="grid lg:grid-cols-2 items-center h-full gap-16">
					
					{/* Left Column: Image/Graphic (visible on desktop) */}
					<div className="hidden lg:flex items-center justify-center h-full">
						<Logo className="w-2/3 h-auto max-w-xs" />
					</div>

					{/* Right Column: Content */}
					<div className="flex flex-col items-center lg:items-start text-center lg:text-left">
						
						{/* Graphic for Mobile View */}
						<div className="lg:hidden mb-12">
							<Logo className="w-40 h-auto" />
						</div>

						{/* Text Content */}
						<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
							<h1 className="text-4xl md:text-5xl font-bold leading-tight">
								Discipline Planner
							</h1>
							<AiTag />
						</div>

						<p className="mt-2 text-lg text-gray-600 max-w-md">
							Build lasting disciplines and achieve your goals, one day.
						</p>

						{/* Action Buttons */}
						<div className="mt-10 w-full max-w-xs space-y-4">
							<Link
								href="/login"
								className="w-full block bg-black text-white font-semibold py-4 px-4 rounded-lg text-center hover:bg-gray-800 transition-colors duration-300">
								Sign In
							</Link>
							<Link
								href="/signup"
								className="w-full block bg-white text-black font-semibold py-4 px-4 rounded-lg text-center border-2 border-black hover:bg-gray-100 transition-colors duration-300">
								Create account
							</Link>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}

export default Home;