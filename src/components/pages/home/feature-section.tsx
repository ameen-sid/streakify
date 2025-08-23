import React from "react";
import { motion } from "framer-motion";
import {
	Bot,
	BarChart,
	ShieldCheck,
	GitBranch,
	Trash2,
	Repeat,
	BrainCircuit,
	Zap,
	Star,
} from "lucide-react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import FeatureCard from "./feature-card";
import { APP_NAME } from "@/constant";

const FeaturesSection = () => {
	
	const animationProps = useScrollAnimation();
	const features = {
		"AI-Powered Enhancement": [
			{
				icon: <Bot size={24} />,
				title: "AI Coaching Tips",
				description:
					"Receive personalized suggestions and motivational tips from the Gemini API to stay on track.",
			},
			{
				icon: <Zap size={24} />,
				title: "Smart Task Highlights",
				description:
					"AI identifies and highlights key tasks to help you prioritize your day for maximum impact.",
			},
			{
				icon: <BrainCircuit size={24} />,
				title: "Personalized Suggestions",
				description:
					"Get intelligent recommendations for new habits based on your goals and progress.",
			},
		],
		"Robust Platform & Security": [
			{
				icon: <ShieldCheck size={24} />,
				title: "Secure Authentication",
				description:
					"GDPR-compliant system with email verification and secure account management.",
			},
			{
				icon: <Trash2 size={24} />,
				title: "Scheduled Deletion",
				description:
					"Users have full control with scheduled data deletion and easy recovery options.",
			},
			{
				icon: <GitBranch size={24} />,
				title: "Automated Workflows",
				description:
					"Cron jobs & GitHub Actions for reminders, inactivity alerts, and data cleanup.",
			},
		],
		"Analytics & Tracking": [
			{
				icon: <BarChart size={24} />,
				title: "Dynamic Dashboard",
				description:
					"Visualize your progress with real-time charts and an engaging overview of your habits.",
			},
			{
				icon: <Repeat size={24} />,
				title: "Streak Tracking",
				description:
					"Stay motivated by building and maintaining streaks for all your important habits.",
			},
			{
				icon: <Star size={24} />,
				title: "AI-Generated Feedback",
				description:
					"Receive insightful, AI-generated feedback on your weekly reports to refine your strategy.",
			},
		],
	};

	return (
		<section id="features" className="py-24 sm:py-32">
			<div className="container mx-auto px-6">
				<motion.div
					{...animationProps}
					className="text-center max-w-3xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
						Everything You Need to Succeed
					</h2>
					<p className="text-lg text-gray-400 mb-12">
						From intelligent coaching to robust security, {APP_NAME} is built with powerful features to help you build lasting habits.
					</p>
				</motion.div>

				{Object.entries(features).map(([category, featureList]) => (
					<div key={category} className="mb-16">
						<motion.h3
							{...animationProps}
							className="text-2xl font-bold tracking-tight text-blue-400 mb-8 text-center">
							{category}
						</motion.h3>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{featureList.map((feature, i) => (
								<FeatureCard
									key={feature.title}
									{...feature}
									index={i}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default FeaturesSection;