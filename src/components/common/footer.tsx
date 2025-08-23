import React from "react";
import Link from "next/link";
import { 
	BrainCircuit, 
	Twitter,
	Github,
	Linkedin, 
} from "lucide-react";
import { APP_NAME } from "@/constant";

const Footer = () => (
	<footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8">
		<div className="container mx-auto px-6">
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
				<div className="col-span-2 lg:col-span-1">
					<div className="flex items-center gap-3 mb-4">
						<BrainCircuit className="w-8 h-8 text-blue-400" />
						<span className="text-2xl font-bold">{APP_NAME}</span>
					</div>
					<p className="text-gray-400 text-sm">
						Build discipline with AI.
					</p>
				</div>
				<div>
					<h3 className="font-bold text-white mb-4">Product</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/features"
								className="text-gray-400 hover:text-white">
								Features
							</Link>
						</li>
						<li>
							<Link
								href="/pricing"
								className="text-gray-400 hover:text-white">
								Pricing
							</Link>
						</li>
						<li>
							<Link
								href="/updates"
								className="text-gray-400 hover:text-white">
								Updates
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="font-bold text-white mb-4">Company</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/about"
								className="text-gray-400 hover:text-white">
								About
							</Link>
						</li>
						<li>
							<Link
								href="/blog"
								className="text-gray-400 hover:text-white">
								Blog
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								className="text-gray-400 hover:text-white">
								Contact
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="font-bold text-white mb-4">Legal</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/privacy-policy"
								className="text-gray-400 hover:text-white">
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link
								href="/terms-of-services"
								className="text-gray-400 hover:text-white">
								Terms of Service
							</Link>
						</li>
					</ul>
				</div>
			</div>

			<div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
				<p className="text-gray-500 text-sm mb-4 sm:mb-0">
					&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
				</p>
				<div className="flex space-x-4">
					<Link href="https://twitter.com/AmeenSid7" className="text-gray-500 hover:text-white">
						<Twitter />
					</Link>
					<Link href="https://github.com/ameen-sid" className="text-gray-500 hover:text-white">
						<Github />
					</Link>
					<Link href="https://www.linkedin.com/in/ameen-sid" className="text-gray-500 hover:text-white">
						<Linkedin />
					</Link>
				</div>
			</div>
		</div>
	</footer>
);

export default Footer;