import React from "react";
import { motion } from "framer-motion";
import { Check, Bot } from "lucide-react"
import { useScrollAnimation } from "@/hooks";

const AppMockup = () => {

	const animationProps = useScrollAnimation();
	return (
		<motion.div
			{...animationProps}
			id="dashboard"
			className="container mx-auto px-6 -mt-20 relative z-20">
			<div className="relative mx-auto border-gray-700 bg-gray-800 border-[8px] rounded-t-xl w-full max-w-4xl h-auto shadow-2xl shadow-blue-900/20">
				<div className="rounded-lg overflow-hidden h-full bg-gray-900">
					<div className="w-full h-8 md:h-12 bg-gray-800 flex items-center px-4 gap-2">
						<div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500"></div>
						<div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500"></div>
						<div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500"></div>
					</div>
					<div className="p-4 md:p-6 lg:p-8">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
							<div className="lg:col-span-2 space-y-3 md:space-y-4">
								<h2 className="text-lg md:text-xl font-bold text-white mb-2">
									Today's Habits
								</h2>
								<div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between transition-all hover:bg-gray-700/80">
									<span className="text-sm md:text-base">
										Workout for 30 minutes
									</span>
									<div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center ring-2 ring-green-500">
										<Check className="w-4 h-4 text-green-300" />
									</div>
								</div>
								<div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between transition-all hover:bg-gray-700/80">
									<span className="text-sm md:text-base">
										Read 10 pages of a book
									</span>
									<div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
								</div>
								<div className="bg-blue-900/50 border border-blue-700 p-3 rounded-lg flex items-center justify-between ring-2 ring-blue-600 shadow-lg shadow-blue-500/10">
									<span className="text-sm md:text-base font-semibold text-blue-200">
										Meditate for 5 minutes
									</span>
									<div className="w-6 h-6 rounded-full border-2 border-blue-400"></div>
								</div>
							</div>
							<div className="space-y-4 md:space-y-6">
								<div className="bg-gray-800 p-4 rounded-xl text-center">
									<p className="text-gray-400 text-xs md:text-sm font-medium">
										CURRENT STREAK
									</p>
									<p className="text-3xl md:text-4xl font-bold text-blue-400">
										21{" "}
										<span className="text-lg text-gray-400">
											Days
										</span>
									</p>
								</div>
								<div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
									<h3 className="font-bold flex items-center gap-2 text-sm md:text-base">
										<Bot className="w-5 h-5 text-blue-400" />{" "}
										AI Coach
									</h3>
									<p className="text-xs md:text-sm text-gray-300 mt-2">
										"You've completed your workout 3 days in
										a row. Amazing consistency!"
									</p>
								</div>
							</div>
							<div className="lg:col-span-3 bg-gray-800 p-4 rounded-xl mt-2">
								<h3 className="font-bold mb-3 text-base md:text-lg text-white">
									Monthly Progress
								</h3>
								<div className="flex justify-between items-end h-24 md:h-32 space-x-1">
									{Array.from({ length: 30 }).map((_, i) => (
										<motion.div
											key={i}
											className="w-full bg-blue-500 rounded-t-sm"
											initial={{ height: 0 }}
											whileInView={{
												height: `${
													Math.floor(
														Math.random() * 80
													) + 20
												}%`,
											}}
											viewport={{
												once: true,
												amount: 0.8,
											}}
											transition={{
												duration: 0.5,
												delay: i * 0.02,
											}}>
										</motion.div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default AppMockup;