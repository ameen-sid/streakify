import React, { ReactNode } from "react";
import { motion } from "framer-motion";

const VerificationCard = ({ icon, title, message, actionButton = null, actionForm = null }: { icon: ReactNode, title: string, message: string, actionButton?: ReactNode | null, actionForm?: ReactNode | null }) => {

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={cardVariants}
			className="max-w-md mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl"
		>
			<div className="flex justify-center mb-6">
				{icon}
			</div>
			<h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
			<p className="text-gray-400 mb-8 min-h-[48px]">{message}</p>
			{actionButton}
			{actionForm}
		</motion.div>
	);
};

export default VerificationCard;