import React from "react";
import Link from "next/link";
import { Home, ListTodo } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* Left Column: Text Content */}
                    <div className="text-center md:text-left">
                        <p className="text-lg font-semibold text-black uppercase tracking-wider">
                            Error 404
                        </p>
                        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
                            Page not found
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            Sorry, we couldn’t find the page you’re looking for. It might have been moved or the URL may be incorrect.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-black hover:bg-gray-800"
                            >
                                <Home size={20} className="mr-2" />
                                Go to Homepage
                            </Link>
                            <Link
                                href="/logs/today"
                                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg shadow-sm text-base font-semibold text-black bg-white hover:bg-gray-50"
                            >
                                <ListTodo size={20} className="mr-2" />
                                Go to Today&apos;s Plan
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Graphic */}
                    <div className="hidden md:flex items-center justify-center">
                        <div className="relative w-full max-w-md">
                            <p className="text-[12rem] lg:text-[16rem] font-black text-gray-100 leading-none">404</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;