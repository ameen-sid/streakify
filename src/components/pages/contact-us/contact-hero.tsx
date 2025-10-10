import React from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks";

const ContactHero = () => {

    const animationProps = useScrollAnimation();
    return (
        <motion.div {...animationProps} className="text-center py-16 md:py-24">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter  mb-4">
                Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Have a question, feedback, or just want to say hello? I'd love to hear from you. Drop me a message below.
            </p>
        </motion.div>
    );
};

export default ContactHero;