import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks";
import nextjs from "../../../../public/assets/icons/nextjs.svg";
import react from "../../../../public/assets/icons/react.svg";
import tailwindcss from "../../../../public/assets/icons/tailwind-css.svg";
import gemini from "../../../../public/assets/icons/gemini-ai.svg";
import mongodb from "../../../../public/assets/icons/mongodb.svg";
import vercel from "../../../../public/assets/icons/vercel.svg";
import github from "../../../../public/assets/icons/github.svg";

const TechStackSection = () => {

	const animationProps = useScrollAnimation();
	const techs = [
		{
			name: "Next.js",
			logo: nextjs,
		},
		{
			name: "React",
			logo: react,
		},
		{
			name: "Tailwind CSS",
			logo: tailwindcss,
		},
		{
			name: "Gemini API",
			logo: gemini,
		},
		{
			name: "MongoDB",
			logo: mongodb,
		},
		{
			name: "Vercel",
			logo: vercel,
		},
		{
			name: "GitHub Actions",
			logo: github,
		},
	];

	return (
		<section id="tech" className="bg-black/20 py-20 sm:py-24">
			<div className="container mx-auto px-6">
				<motion.div {...animationProps} className="text-center">
					<h2 className="text-3xl font-extrabold tracking-tight mb-4">
						Built with a Modern, Full-Stack Architecture
					</h2>
					<p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
						This project leverages cutting-edge technologies to
						deliver a fast, secure, and intelligent user experience.
					</p>
				</motion.div>
				<motion.div
					{...animationProps}
					transition={{ staggerChildren: 0.1 }}
					className="flex flex-wrap justify-center items-center gap-x-8 gap-y-8 md:gap-x-16">
					{techs.map((tech) => (
						<motion.div
							key={tech.name}
							className="flex items-center gap-4 group"
							variants={{
								initial: { opacity: 0, y: 20 },
								whileInView: { opacity: 1, y: 0 },
							}}>
							<Image
								src={tech.logo}
								alt={`${tech.name} logo`}
								width={10}
								height={10}
								className="h-10 w-10 md:h-12 md:w-12 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.onerror = null;
									target.src =
										`https://placehold.co/48x48/111827/4c51bf?text=${tech.name}`;
								}}
							/>
							<span className="text-lg text-gray-400 group-hover:text-white transition-colors">
								{tech.name}
							</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default TechStackSection;