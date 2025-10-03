import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Menu, X } from "lucide-react";
import { APP_NAME, NAV_LINKS } from "@/constant";

const Header = () => {

	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menuVariants = {
		closed: { opacity: 0, y: -20, transition: { duration: 0.2 } },
		open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
	};

	const NavLink = ({ href, label } : { href: string, label: string }) => {
        const isActive = pathname === href;
        const activeClass = "text-blue-400 font-semibold";
        const inactiveClass = "text-gray-300 hover:text-white transition-colors";

        return (
            <Link href={href} className={isActive ? activeClass : inactiveClass}>
                {label}
            </Link>
        );
    };

	return (
		<header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				<div className="flex items-center gap-3">
					<BrainCircuit className="w-8 h-8 text-blue-400" />
					<span className="text-2xl font-bold tracking-tight">
						{APP_NAME}
					</span>
				</div>

				<nav className="hidden md:flex items-center gap-6">
					{NAV_LINKS.map(link => <NavLink key={link.label} {...link} />)}
				</nav>
				<div className="hidden md:flex items-center gap-4">
					<Link href="/login">
						<button className="text-gray-300 hover:text-white transition-colors">Sign In</button>
					</Link>
					<Link href="/signup">
						<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg">Create Account</button>
					</Link>
				</div>

				<div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
			</div>

			<motion.div
                initial="closed"
                animate={isMenuOpen ? 'open' : 'closed'}
                variants={menuVariants}
                className="md:hidden absolute top-full left-0 right-0 bg-gray-950/95 backdrop-blur-lg border-b border-gray-800"
            >
				{isMenuOpen && (
                    <nav className="flex flex-col items-center gap-4 p-6">
						{NAV_LINKS.map(link => <NavLink key={link.label} {...link} />)}
                        <div className="w-full border-t border-gray-800 my-2"></div>
                        <Link href="/login">
							<button className="text-gray-300 hover:text-white">Sign In</button>
						</Link>
						<Link href="/signup">
							<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg w-full">
								Create Account
							</button>
						</Link>
                    </nav>
                )}
			</motion.div>
		</header>
	);
};

export default Header;