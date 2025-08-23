import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, ArrowRight } from "lucide-react"
import useScrollAnimation from "@/hooks/useScrollAnimation";

const HeroSection = () => {
	
	const animationProps = useScrollAnimation();
	return (
		<section className="relative pt-24 pb-32 text-center overflow-hidden">
			<div className="absolute inset-0 bg-grid-gray-800/[0.1] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
			<motion.div
				{...animationProps}
				className="container mx-auto px-6 relative z-10">
				<div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 text-blue-300 px-4 py-1 rounded-full text-sm mb-6">
					<Bot className="w-4 h-4" />
					<span>AI-Enhanced Tracking</span>
				</div>
				<h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-6">
					Build Lasting Disciplines.
					<br />
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
						With Intelligent Habit Tracking.
					</span>
				</h1>
				<p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
					Stay consistent, track streaks, and get personalized
					coaching tips powered by AI. Achieve your goals, one step at
					a time.
				</p>
				<div className="flex justify-center items-center gap-4">
					<Link href="/signup">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2">
							Get Started Free <ArrowRight className="w-5 h-5" />
						</motion.button>
					</Link>
				</div>
			</motion.div>
		</section>
	);
};

export default HeroSection;