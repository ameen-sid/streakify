import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Menu, X } from "lucide-react";
import { APP_NAME } from "@/constant";

const Header = () => {
	
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
			className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<BrainCircuit className="w-8 h-8 text-blue-400" />
					<span className="text-2xl font-bold tracking-tight">
						{APP_NAME}
					</span>
				</div>

				<nav className="hidden md:flex items-center gap-6">
					<Link
						href="#features"
						className="text-gray-300 hover:text-white transition-colors">
						Features
					</Link>
					<Link
						href="#tech"
						className="text-gray-300 hover:text-white transition-colors">
						Technology
					</Link>
					<Link
						href="#dashboard"
						className="text-gray-300 hover:text-white transition-colors">
						Dashboard
					</Link>
				</nav>

				<div className="hidden md:flex items-center gap-4">
					<Link href="/login">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="text-gray-300 cursor-pointer hover:text-white transition-colors">
							Sign In
						</motion.button>
					</Link>
					<Link href="/signup">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg">
							Create Account
						</motion.button>
					</Link>
				</div>

				<div className="md:hidden">
					<button onClick={() => setIsMenuOpen(!isMenuOpen)}>
						{isMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden bg-gray-950/90 backdrop-blur-lg overflow-hidden">
						<nav className="flex flex-col items-center gap-4 px-6 pt-2 pb-4">
							{["Features", "Technology", "Dashboard"].map(
								(item, i) => (
									<motion.a
										key={item}
										href={`#${item.toLowerCase()}`}
										className="text-gray-300 hover:text-white transition-colors w-full text-center py-2"
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.1 }}
										onClick={() => setIsMenuOpen(false)}>
										{item}
									</motion.a>
								)
							)}
							<div className="flex flex-col items-center gap-4 w-full pt-4 border-t border-gray-800">
								<Link href="/login">
									<motion.button
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3 }}
										className="text-gray-300 cursor-pointer hover:text-white transition-colors w-full py-2">
										Sign In
									</motion.button>
								</Link>
								<Link href="/signup">
									<motion.button
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold w-full px-5 py-2 rounded-lg">
										Create Account
									</motion.button>
								</Link>
							</div>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
};

export default Header;