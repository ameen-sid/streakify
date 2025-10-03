"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Github,
    Twitter,
    Linkedin,
    Mail,
    MessageSquare,
    Send,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks";
import { Header, Footer } from "@/components/common";

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

const ContactForm = () => {

    const animationProps = useScrollAnimation();
    return (
        <motion.div {...animationProps} className="grid md:grid-cols-2 gap-12 items-start my-16">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Send a Message</h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input type="text" id="name" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <input type="email" id="email" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">Reason for Contact</label>
                        <select id="reason" className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
                            <option>General Inquiry</option>
                            <option>Bug Report</option>
                            <option>Feature Request</option>
                            <option>Account Support</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                        <textarea id="message" rows={5} className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                        <Send size={18} />
                        Send Message
                    </button>
                </form>
            </div>
            <div className="space-y-8 bg-gray-900/50 p-8 rounded-lg border border-gray-800">
                <h3 className="text-2xl font-bold">Other Ways to Reach Out</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-full">
							<Mail className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">Email</h4>
                            <p className="text-gray-400">For general inquiries and support.</p>
                            <Link href="mailto:hello@streakify.com" className="text-blue-400 hover:underline">ameensid7@outlook.com</Link>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-full">
							<MessageSquare className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">Social Media</h4>
                            <p className="text-gray-400">Follow the journey and get in touch.</p>
                            <div className="flex items-center gap-4 mt-2">
                                <Link href="https://twitter.com/AmeenSid7" className="text-gray-400 hover:text-white"><Twitter size={20} /></Link>
                                <Link href="https://github.com/ameen-sid" className="text-gray-400 hover:text-white"><Github size={20} /></Link>
                                <Link href="https://www.linkedin.com/in/ameen-sid" className="text-gray-400 hover:text-white"><Linkedin size={20} /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ContactUsPage = () => {
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
                <ContactHero />
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
};

export default ContactUsPage;