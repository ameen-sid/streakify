import React from "react";
import { motion } from "framer-motion";
import { Zap, Users, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks";

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

export default OurValues;