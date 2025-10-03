import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

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

export default OurStory;