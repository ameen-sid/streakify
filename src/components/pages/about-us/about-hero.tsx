import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks";

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

export default AboutHero;