import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	Github,
    Twitter,
    Linkedin,
    Mail,
    MessageSquare,
    Send,
	Loader,
} from "lucide-react";
import toast from "react-hot-toast";
import { useScrollAnimation } from "@/hooks";
import { submitContactForm } from "@/services";
import { AxiosError } from "axios";

export type userFormData = {
	fullname: string;
	email: string;
	reason: string;
	message: string;
};

const initialState: userFormData = {
	fullname: "",
	email: "",
	reason: "General Inquiry",
	message: "",
};

const ContactForm = () => {

    const animationProps = useScrollAnimation();

	const [formData, setFormData] = useState<userFormData>(initialState);
	const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

		const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Sending your message...");
        try {

            await submitContactForm(formData);
            toast.success("Message sent successfully! We'll be in touch.", { id: toastId });

			setFormData(initialState);
        } catch (error) {

            const message = error instanceof AxiosError ? error.response?.data.message : "An API error occurred.";
            toast.error(message, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div {...animationProps} className="grid md:grid-cols-2 gap-12 items-start my-16">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">Reason for Contact</label>
                        <select
                            id="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                        >
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Bug Report">Bug Report</option>
                            <option value="Feature Request">Feature Request</option>
                            <option value="Account Support">Account Support</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                        <textarea
                            id="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                        {loading ? 'Sending...' : 'Send Message'}
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

export default ContactForm;