"use client";

import React from "react";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import AiTag from "@/components/ai-tag";
import { APP_NAME } from "@/constant";

const Home = () => {
	return (
		<div className="min-h-screen bg-white text-black font-sans">
			<div className="container mx-auto px-4 h-screen">
				<div className="grid lg:grid-cols-2 items-center h-full gap-16">
					
					{/* Left Column: Image/Graphic (visible on desktop) */}
					<div className="hidden lg:flex items-center justify-center h-full">
						<BrainCircuit className="w-2/3 h-auto max-w-xs text-black" />
					</div>

					{/* Right Column: Content */}
					<div className="flex flex-col items-center lg:items-start text-center lg:text-left">
						
						{/* Graphic for Mobile View */}
						<div className="lg:hidden mb-12">
							<BrainCircuit className="w-40 h-auto text-black" />
						</div>

						{/* Text Content */}
						<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
							<h1 className="text-4xl md:text-5xl font-bold leading-tight">
								{APP_NAME}
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