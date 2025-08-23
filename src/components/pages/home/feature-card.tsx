import React from "react";
import { motion } from "framer-motion";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const FeatureCard = ({ icon, title, description, index }: any) => {
	
	const animationProps = useScrollAnimation();
	return (
		<motion.div
			{...animationProps}
			transition={{ duration: 0.6, delay: index * 0.1 }}
			className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1">
			<div className="w-12 h-12 bg-gray-800/50 text-blue-400 rounded-lg flex items-center justify-center mb-4">
				{icon}
			</div>
			<h3 className="text-xl font-bold mb-2">{title}</h3>
			<p className="text-gray-400">{description}</p>
		</motion.div>
	);
};

export default FeatureCard;