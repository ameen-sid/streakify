"use client";

import React from "react";
import Link from "next/link";
import { MailCheck, ArrowLeft } from "lucide-react";

const VerifyEmailPage = () =>  {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col items-center text-center overflow-hidden p-8 sm:p-12">
                
                {/* Icon */}
                <div className="bg-black text-white p-4 rounded-full mb-6">
                    <MailCheck className="h-12 w-12" />
                </div>

                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-black">Verify your email</h1>
                    <p className="mt-4 text-gray-600 max-w-xs">
                        We've sent a verification link to <span className="font-semibold text-black">your email</span>. Please check your inbox and click the link to activate your account.
                    </p>

                    <p className="mt-8 text-xs text-gray-500">
                        Can't find the email? Check your spam folder.
                    </p>
                </main>

                 {/* Footer Link */}
                <footer className="mt-8 pt-4 border-t border-gray-200 w-full">
                     <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </footer>
            </div>
        </div>
    );
}

export default VerifyEmailPage;