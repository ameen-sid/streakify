import React, { ReactNode } from "react";
import Link from "next/link";

const AuthButton = ({ href, children }: { href: string, children: ReactNode}) => (
    <Link
        href={href}
        className="w-full block text-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
    >
        {children}
    </Link>
);

export default AuthButton;