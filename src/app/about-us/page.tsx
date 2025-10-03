"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Target,
    Zap,
    Users,
    Heart,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks";
import { Footer } from "@/components/common";
import { Header } from "@/components/pages/home";

const AboutHero = () => {

    const animationProps = useScrollAnimation();
    return (
        <section className="py-16 md:py-24">
            <motion.div {...animationProps} className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
                        A <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500">Solo Mission</span> to Build Better Habits
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">
                        I'm a passionate developer dedicated to blending technology with human potential. Discover the story and the mission that drives Streakify forward.
                    </p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                    <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80" alt="Solo developer coding" className="rounded-md shadow-2xl" />
                </div>
            </motion.div>
        </section>
    );
};

const OurStory = () => {

    const animationProps = useScrollAnimation();
    return (
        <motion.div {...animationProps} className="grid md:grid-cols-2 gap-12 items-center my-16">
            <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800 order-last md:order-first">
                <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Developer's desk with notes and laptop" className="rounded-md shadow-2xl" />
            </div>
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                    <Target className="w-4 h-4" />
                    <span>The Why</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">From a Personal Project to a Powerful Tool</h2>
                <p className="text-gray-400">
                    Streakify started with a common problem: my own struggle to stay consistent. I knew how hard it was to build new habits and break old ones. I wanted to create more than just a simple checklist; I envisioned a smart companion that understands the journey and actively helps you succeed.
                </p>
                <p className="text-gray-400">
                    By integrating cutting-edge AI, I've built a platform that not only tracks progress but also provides personalized insights and motivation to keep you on the right path.
                </p>
            </div>
        </motion.div>
    );
};

const OurValues = () => {

    const animationProps = useScrollAnimation();

	const values = [
        { icon: Zap, title: "Innovation", description: "Leveraging the latest in AI to create a smarter, more effective habit-building experience." },
        { icon: Users, title: "User-Centric", description: "Your journey is my priority. I design every feature with your success and privacy in mind." },
        { icon: Heart, title: "Empowerment", description: "I'm here to give you the tools and confidence to take control of your daily life and achieve your goals." },
    ];

    return (
        <motion.div {...animationProps} className="my-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-12">What Drives Me</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                    <div key={index} className="bg-gray-900/50 p-8 rounded-lg border border-gray-800">
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-500/10 p-3 rounded-full">
                                <value.icon className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                        <p className="text-gray-400">{value.description}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const AboutUsPage = () => {
    return (
        <div
            className="bg-gray-950 text-white font-sans antialiased"
            style={{
                backgroundImage: `
                radial-gradient(circle at top left, rgba(29, 78, 216, 0.1), transparent 40%),
                radial-gradient(circle at top right, rgba(29, 78, 216, 0.1), transparent 40%),
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px) `,
                backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
            }}>
            <Header />
            <main className="container mx-auto px-6">
                <AboutHero />
                <OurStory />
                <OurValues />
            </main>
            <Footer />
        </div>
    );
}

export default AboutUsPage;