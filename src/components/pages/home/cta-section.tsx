import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const CTASection = () => {
	
	const animationProps = useScrollAnimation();
	return (
		<section className="py-24 sm:py-32">
			<motion.div
				{...animationProps}
				className="container mx-auto px-6 text-center">
				<div className="relative bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 overflow-hidden">
					<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full filter blur-xl"></div>
					<div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full filter blur-xl"></div>
					<div className="relative z-10">
						<h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
							Ready to Transform Your Habits?
						</h2>
						<p className="max-w-xl mx-auto text-lg text-blue-100 mb-8">
							Stop procrastinating and start achieving. Get your
							personalized AI coach and build the discipline
							you've always wanted.
						</p>
						<Link href="/signup">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-white cursor-pointer text-gray-900 font-bold px-8 py-4 rounded-lg text-lg shadow-2xl">
								Sign Up for Free
							</motion.button>
						</Link>
					</div>
				</div>
			</motion.div>
		</section>
	);
};

export default CTASection;