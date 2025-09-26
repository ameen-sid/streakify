"use client";

import React from "react";
import { Header, HeroSection, AppMockup, FeaturesSection, TechStackSection, CTASection } from "@/components/pages/home";
import { Footer } from "@/components/common";

const StreakifyHomepage = () => {
	return (
		<div className="relative overflow-hidden">
			{/* Decorative background blobs for the glassmorphism effect */}
			<div className="absolute top-0 -left-1/3 w-2/3 h-2/3 bg-blue-500/20 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
			<div className="absolute top-0 -right-1/3 w-2/3 h-2/3 bg-purple-500/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
			<div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

			<div className="relative z-10">
				<Header />
				<main>
					<HeroSection />
					<AppMockup />
					<FeaturesSection />
					<TechStackSection />
					<CTASection />
				</main>
				<Footer />
			</div>
			<style>{`
				@keyframes blob {
				0% { transform: translate(0px, 0px) scale(1); }
				33% { transform: translate(30px, -50px) scale(1.1); }
				66% { transform: translate(-20px, 20px) scale(0.9); }
				100% { transform: translate(0px, 0px) scale(1); }
				}
				.animate-blob {
				animation: blob 7s infinite;
				}
				.animation-delay-2000 {
				animation-delay: 2s;
				}
				.animation-delay-4000 {
				animation-delay: 4s;
				}
				.bg-grid-gray-800\\/\\[0\\.1\\] {
					background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px);
					background-size: 4rem 4rem;
					background-color: transparent;
					opacity: 0.05;
				}
			`}</style>
		</div>
	);
};

const Home = () => {
	return (
		// Using a near-black background for a high-contrast theme
		<div className="bg-gray-950 text-white font-sans antialiased">
			<StreakifyHomepage />
		</div>
	);
};

export default Home;